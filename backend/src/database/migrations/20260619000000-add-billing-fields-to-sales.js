'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('sales');
    if (!tableInfo.billing_date) {
      await queryInterface.addColumn('sales', 'billing_date', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (!tableInfo.additional_charges) {
      await queryInterface.addColumn('sales', 'additional_charges', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('sales');
    if (tableInfo.billing_date) {
      await queryInterface.removeColumn('sales', 'billing_date');
    }
    if (tableInfo.additional_charges) {
      await queryInterface.removeColumn('sales', 'additional_charges');
    }
  }
};
