'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sale_items', 'free_qty', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'quantity' // Adding after quantity for logical order
    });

    await queryInterface.addColumn('sale_items', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'total_price'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sale_items', 'free_qty');
    await queryInterface.removeColumn('sale_items', 'notes');
  }
};
