'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_roles', {
  user_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  },
  role_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    references: { model: 'roles', key: 'id' },
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
    await queryInterface.dropTable('user_roles');
  }
};
