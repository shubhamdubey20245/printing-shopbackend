'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permissions', {
  role_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    references: { model: 'roles', key: 'id' },
    onDelete: 'CASCADE'
  },
  permission_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    references: { model: 'permissions', key: 'id' },
    onDelete: 'CASCADE'
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
    await queryInterface.dropTable('role_permissions');
  }
};
