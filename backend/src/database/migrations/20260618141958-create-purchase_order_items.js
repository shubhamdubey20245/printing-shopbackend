'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_order_items', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  purchase_order_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'purchase_orders', key: 'id' },
    onDelete: 'CASCADE'
  },
  medicine_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'medicines', key: 'id' }
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
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
    await queryInterface.dropTable('purchase_order_items');
  }
};
