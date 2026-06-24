const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');
const files = fs.readdirSync(migrationsDir).sort();

const schemas = {
  'tenants': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      business_name: { type: Sequelize.STRING, allowNull: false },
      gst_number: { type: Sequelize.STRING, allowNull: true },
      subscription_plan: { type: Sequelize.STRING, allowNull: false, defaultValue: 'FREE' },
      subscription_status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'ACTIVE' },
      expiry_date: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'users': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      last_login: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'roles': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'permissions': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      module: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true }`,
  'role_permissions': `
      role_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE' },
      permission_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE' }`,
  'user_roles': `
      user_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      role_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE' }`,
  'categories': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'customers': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'suppliers': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      contact_person: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'medicines': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      category_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'categories', key: 'id' }, onDelete: 'SET NULL' },
      name: { type: Sequelize.STRING, allowNull: false },
      generic_name: { type: Sequelize.STRING, allowNull: true },
      manufacturer: { type: Sequelize.STRING, allowNull: true },
      barcode: { type: Sequelize.STRING, allowNull: true },
      batch_number: { type: Sequelize.STRING, allowNull: false },
      purchase_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      selling_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      mrp: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      gst_percentage: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      stock_quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      minimum_stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10 },
      expiry_date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'purchase_orders': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      supplier_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'suppliers', key: 'id' }, onDelete: 'CASCADE' },
      order_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      status: { type: Sequelize.STRING, defaultValue: 'PENDING' },
      total_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'purchase_order_items': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      purchase_order_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'purchase_orders', key: 'id' }, onDelete: 'CASCADE' },
      medicine_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'medicines', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false }`,
  'sales': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      invoice_number: { type: Sequelize.STRING, allowNull: false },
      customer_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'customers', key: 'id' }, onDelete: 'SET NULL' },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      gst_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      total_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      payment_method: { type: Sequelize.STRING, allowNull: false, defaultValue: 'CASH' },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'sale_items': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      sale_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sales', key: 'id' }, onDelete: 'CASCADE' },
      medicine_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'medicines', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      gst: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false }`,
  'returns': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      sale_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sales', key: 'id' }, onDelete: 'CASCADE' },
      return_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      total_refund_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
      reason: { type: Sequelize.TEXT, allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'return_items': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      return_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'returns', key: 'id' }, onDelete: 'CASCADE' },
      sale_item_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'sale_items', key: 'id' }, onDelete: 'CASCADE' },
      medicine_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'medicines', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      refund_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false }`,
  'inventory_transactions': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      medicine_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'medicines', key: 'id' }, onDelete: 'CASCADE' },
      transaction_type: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      reference_id: { type: Sequelize.UUID, allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'notifications': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      type: { type: Sequelize.STRING, defaultValue: 'INFO' },
      title: { type: Sequelize.STRING, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      is_read: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }`,
  'tenant_settings': `
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      tenant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      key: { type: Sequelize.STRING, allowNull: false },
      value: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.STRING, defaultValue: 'STRING' }`
};

files.forEach(file => {
  if (!file.endsWith('.js')) return;
  const tableMatch = file.match(/-create-(.*)\.js/);
  if (tableMatch) {
    const tableName = tableMatch[1];
    const schema = schemas[tableName];
    
    if (schema) {
      const content = "'use strict';\\n\\n" +
"module.exports = {\\n" +
"  up: async (queryInterface, Sequelize) => {\\n" +
"    await queryInterface.createTable('" + tableName + "', {\\n" +
schema +
"\\n    });" + (tableName === 'tenant_settings' ? "\\n    await queryInterface.addIndex('" + tableName + "', ['tenant_id', 'key'], { unique: true });" : "") + "\\n" +
"  },\\n\\n" +
"  down: async (queryInterface, Sequelize) => {\\n" +
"    await queryInterface.dropTable('" + tableName + "');\\n" +
"  }\\n" +
"};\\n";
      fs.writeFileSync(path.join(migrationsDir, file), content);
      console.log("Updated " + file);
    }
  }
});
