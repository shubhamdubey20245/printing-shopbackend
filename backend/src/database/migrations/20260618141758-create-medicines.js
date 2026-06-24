'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medicines', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' }
  },
  category_id: {
    type: Sequelize.UUID,
    allowNull: true,
    references: { model: 'categories', key: 'id' }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  generic_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  manufacturer: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  barcode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  batch_number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  purchase_price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  selling_price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  mrp: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  gst_percentage: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  minimum_stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
  expiry_date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
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
    await queryInterface.dropTable('medicines');
  }
};
