'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sale_items', 'purchase_price_snapshot', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    });
    
    await queryInterface.addColumn('sale_items', 'discount_snapshot', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn('sale_items', 'profit_snapshot', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sale_items', 'purchase_price_snapshot');
    await queryInterface.removeColumn('sale_items', 'discount_snapshot');
    await queryInterface.removeColumn('sale_items', 'profit_snapshot');
  }
};
