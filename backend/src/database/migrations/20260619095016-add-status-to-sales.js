'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'status', {
      type: Sequelize.ENUM('DRAFT', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'COMPLETED'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sales', 'status');
  }
};
