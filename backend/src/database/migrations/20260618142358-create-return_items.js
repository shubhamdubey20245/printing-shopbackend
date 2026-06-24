'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('return_items', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  return_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'returns', key: 'id' },
    onDelete: 'CASCADE'
  },
  sale_item_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'sale_items', key: 'id' }
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
  refund_amount: {
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
    await queryInterface.dropTable('return_items');
  }
};
