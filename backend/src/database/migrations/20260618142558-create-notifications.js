'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
    onDelete: 'CASCADE'
  },
  user_id: {
    type: Sequelize.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'INFO',
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  is_read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
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
    await queryInterface.dropTable('notifications');
  }
};
