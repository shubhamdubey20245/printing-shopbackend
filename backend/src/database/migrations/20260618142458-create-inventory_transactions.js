'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventory_transactions', {
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
  medicine_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'medicines', key: 'id' }
  },
  transaction_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  reference_id: {
    type: Sequelize.UUID,
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
    await queryInterface.dropTable('inventory_transactions');
  }
};
