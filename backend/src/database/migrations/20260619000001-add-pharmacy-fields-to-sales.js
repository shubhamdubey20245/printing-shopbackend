'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('sales');
    
    const addColumnIfNotExists = async (columnName, type, options = {}) => {
      if (!tableInfo[columnName]) {
        await queryInterface.addColumn('sales', columnName, { type, ...options });
      }
    };

    await addColumnIfNotExists('patient_age', Sequelize.INTEGER, { allowNull: true });
    await addColumnIfNotExists('patient_gender', Sequelize.STRING, { allowNull: true });
    await addColumnIfNotExists('patient_address', Sequelize.STRING, { allowNull: true });
    await addColumnIfNotExists('doctor_name', Sequelize.STRING, { allowNull: true });
    await addColumnIfNotExists('doctor_reg_no', Sequelize.STRING, { allowNull: true });
    await addColumnIfNotExists('prescription_no', Sequelize.STRING, { allowNull: true });
    await addColumnIfNotExists('prescription_date', Sequelize.DATE, { allowNull: true });
    await addColumnIfNotExists('prescription_image_url', Sequelize.STRING, { allowNull: true });
    await addColumnIfNotExists('notes', Sequelize.TEXT, { allowNull: true });
    await addColumnIfNotExists('amount_received', Sequelize.DECIMAL(10, 2), { allowNull: true, defaultValue: 0 });
    await addColumnIfNotExists('balance_amount', Sequelize.DECIMAL(10, 2), { allowNull: true, defaultValue: 0 });
  },

  down: async (queryInterface, Sequelize) => {
    const columnsToRemove = [
      'patient_age', 'patient_gender', 'patient_address', 'doctor_name', 
      'doctor_reg_no', 'prescription_no', 'prescription_date', 
      'prescription_image_url', 'notes', 'amount_received', 'balance_amount'
    ];
    
    for (const col of columnsToRemove) {
      await queryInterface.removeColumn('sales', col).catch(() => {});
    }
  }
};
