'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('customers');
    
    if (!tableInfo.type) {
      await queryInterface.addColumn('customers', 'type', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'regular',
      });
    }
    
    if (!tableInfo.age) {
      await queryInterface.addColumn('customers', 'age', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!tableInfo.gender) {
      await queryInterface.addColumn('customers', 'gender', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.discount_percent) {
      await queryInterface.addColumn('customers', 'discount_percent', {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customers', 'type');
    await queryInterface.removeColumn('customers', 'age');
    await queryInterface.removeColumn('customers', 'gender');
    await queryInterface.removeColumn('customers', 'discount_percent');
  }
};
