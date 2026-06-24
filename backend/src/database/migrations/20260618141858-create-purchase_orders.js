'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_orders', {
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
  supplier_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'suppliers', key: 'id' }
  },
  order_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'PENDING',
  },
  total_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
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
    await queryInterface.dropTable('purchase_orders');
  }
};
