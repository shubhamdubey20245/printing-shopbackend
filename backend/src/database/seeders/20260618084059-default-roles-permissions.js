'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create Default Tenant
    let tenants = await queryInterface.sequelize.query(
      `SELECT id FROM tenants WHERE name = 'Default Pharmacy' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    let defaultTenantId = tenants.length ? tenants[0].id : uuidv4();

    if (!tenants.length) {
      await queryInterface.bulkInsert('tenants', [{
        id: defaultTenantId,
        name: 'Default Pharmacy',
        business_name: 'Default Pharmacy Ltd.',
        subscription_plan: 'PRO',
        subscription_status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }]);
    }

    // 2. Create Default Roles
    const roleNames = ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER'];
    let existingRoles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER');`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    let rolesToInsert = [];
    let roleMap = {};
    existingRoles.forEach(r => roleMap[r.name] = r.id);

    for (let name of roleNames) {
      if (!roleMap[name]) {
        let newId = uuidv4();
        roleMap[name] = newId;
        rolesToInsert.push({
          id: newId,
          tenant_id: name === 'SUPER_ADMIN' ? null : defaultTenantId,
          name: name,
          description: name === 'SUPER_ADMIN' ? 'System Administrator' :
                       name === 'ADMIN' ? 'Pharmacy Administrator' :
                       name === 'PHARMACIST' ? 'Pharmacist' : 'Cashier / Billing',
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    if (rolesToInsert.length) {
      await queryInterface.bulkInsert('roles', rolesToInsert);
    }

    const superAdminRoleId = roleMap['SUPER_ADMIN'];
    const adminRoleId = roleMap['ADMIN'];
    const pharmacistRoleId = roleMap['PHARMACIST'];
    const cashierRoleId = roleMap['CASHIER'];

    // 3. Create Default Permissions
    const permDefs = [
      { name: 'manage_inventory', module: 'INVENTORY', description: 'Manage inventory and stock' },
      { name: 'view_inventory', module: 'INVENTORY', description: 'View inventory' },
      { name: 'manage_sales', module: 'BILLING', description: 'Create and manage sales' },
      { name: 'view_reports', module: 'REPORTS', description: 'View business reports' },
      { name: 'manage_users', module: 'SETTINGS', description: 'Manage users and roles' }
    ];

    let existingPerms = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    let permsToInsert = [];
    let permMap = {};
    existingPerms.forEach(p => permMap[p.name] = p.id);

    for (let pDef of permDefs) {
      if (!permMap[pDef.name]) {
        let newId = uuidv4();
        permMap[pDef.name] = newId;
        permsToInsert.push({
          id: newId,
          name: pDef.name,
          module: pDef.module,
          description: pDef.description,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    if (permsToInsert.length) {
      await queryInterface.bulkInsert('permissions', permsToInsert);
    }

    // Role Permissions mapping
    await queryInterface.sequelize.query(`DELETE FROM role_permissions WHERE role_id IN ('${superAdminRoleId}', '${adminRoleId}', '${pharmacistRoleId}', '${cashierRoleId}');`);

    const rolePermissions = [];
    // SuperAdmin & Admin get all
    Object.values(permMap).forEach(permId => {
      rolePermissions.push({ role_id: superAdminRoleId, permission_id: permId, created_at: new Date(), updated_at: new Date() });
      rolePermissions.push({ role_id: adminRoleId, permission_id: permId, created_at: new Date(), updated_at: new Date() });
    });
    
    // Pharmacist
    if (permMap['manage_inventory']) rolePermissions.push({ role_id: pharmacistRoleId, permission_id: permMap['manage_inventory'], created_at: new Date(), updated_at: new Date() });
    // Cashier
    if (permMap['view_inventory']) rolePermissions.push({ role_id: cashierRoleId, permission_id: permMap['view_inventory'], created_at: new Date(), updated_at: new Date() });
    if (permMap['manage_sales']) rolePermissions.push({ role_id: cashierRoleId, permission_id: permMap['manage_sales'], created_at: new Date(), updated_at: new Date() });

    if (rolePermissions.length) {
      await queryInterface.bulkInsert('role_permissions', rolePermissions);
    }

    // 4. Create Super Admin User
    let users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@mediflow.com' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    let superAdminId = users.length ? users[0].id : uuidv4();

    if (!users.length) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await queryInterface.bulkInsert('users', [{
        id: superAdminId,
        tenant_id: defaultTenantId,
        email: 'admin@mediflow.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }]);
    }

    // Assign Role to User
    await queryInterface.sequelize.query(`DELETE FROM user_roles WHERE user_id = '${superAdminId}';`);
    await queryInterface.bulkInsert('user_roles', [{
      user_id: superAdminId,
      role_id: superAdminRoleId,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('tenants', null, {});
  }
};
