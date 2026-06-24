'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('sales');
    
    if (!tableInfo.doctor_id) {
      await queryInterface.addColumn('sales', 'doctor_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'doctors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    if (!tableInfo.doctor_commission_amount) {
      await queryInterface.addColumn('sales', 'doctor_commission_amount', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('sales');
    
    if (tableInfo.doctor_id) {
      await queryInterface.removeColumn('sales', 'doctor_id');
    }

    if (tableInfo.doctor_commission_amount) {
      await queryInterface.removeColumn('sales', 'doctor_commission_amount');
    }
  }
};
