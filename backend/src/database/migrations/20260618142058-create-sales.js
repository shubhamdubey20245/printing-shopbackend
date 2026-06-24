'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' }
  },
  invoice_number: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  customer_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  customer_phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  customer_id: {
    type: Sequelize.UUID,
    allowNull: true,
    references: { model: 'customers', key: 'id' }
  },
  subtotal: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  gst_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  discount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_method: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'CASH', // CASH, UPI, CARD
  },
  created_by: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
,
  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false
  }
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales');
  }
};
