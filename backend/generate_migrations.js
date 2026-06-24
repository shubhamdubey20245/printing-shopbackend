const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const tables = [
  'tenants',
  'users',
  'roles',
  'permissions',
  'role_permissions',
  'user_roles',
  'categories',
  'customers',
  'suppliers',
  'medicines',
  'purchase_orders',
  'purchase_order_items',
  'sales',
  'sale_items',
  'returns',
  'return_items',
  'inventory_transactions',
  'notifications',
  'tenant_settings'
];

let now = new Date();

tables.forEach((table, index) => {
  // Increment time by 1 minute for each to preserve order
  const d = new Date(now.getTime() + index * 60000);
  
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  
  const timestamp = `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
  
  const filename = `${timestamp}-create-${table}.js`;
  const filePath = path.join(migrationsDir, filename);
  
  const content = `'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // TODO: Create table ${table}
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('${table}');
  }
};
`;
  
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filename}`);
});
