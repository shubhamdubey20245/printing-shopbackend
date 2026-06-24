'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tenants', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  business_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gst_number: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  subscription_plan: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'FREE',
  },
  subscription_status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  expiry_date: {
    type: Sequelize.DATE,
    allowNull: true,
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
    await queryInterface.dropTable('tenants');
  }
};
