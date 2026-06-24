'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('returns', {
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
  sale_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'sales', key: 'id' }
  },
  return_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  total_refund_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: true,
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
    await queryInterface.dropTable('returns');
  }
};
