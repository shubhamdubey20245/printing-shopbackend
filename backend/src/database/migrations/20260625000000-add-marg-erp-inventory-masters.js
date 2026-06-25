'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create companies table
    await queryInterface.createTable('companies', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_form_pref: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      invoice_printing_pref: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      dump_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      expiry_receive_upto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 90,
      },
      minimum_margin: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      sales_tax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      sales_tax_cess: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      purchase_tax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      purchase_tax_cess: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Create salts table
    await queryInterface.createTable('salts', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Create hsn_sac table
    await queryInterface.createTable('hsn_sac', {
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
      hsn_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      short_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sgst: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      cgst: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      igst: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Goods',
      },
      uqc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cess: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Add minimum_margin to categories
    const catInfo = await queryInterface.describeTable('categories');
    if (!catInfo.minimum_margin) {
      await queryInterface.addColumn('categories', 'minimum_margin', {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }

    // Add Marg ERP columns to medicines
    const medInfo = await queryInterface.describeTable('medicines');
    const cols = {
      company_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'companies', key: 'id' } },
      salt_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'salts', key: 'id' } },
      hsn_sac_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'hsn_sac', key: 'id' } },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'CONTINUE' },
      type: { type: Sequelize.STRING, allowNull: false, defaultValue: 'NORMAL' },
      hide: { type: Sequelize.STRING, allowNull: false, defaultValue: 'NO' },
      packing: { type: Sequelize.STRING, allowNull: true },
      unit_1st: { type: Sequelize.STRING, allowNull: true, defaultValue: 'TAB.' },
      unit_2nd: { type: Sequelize.STRING, allowNull: true, defaultValue: 'STRP' },
      decimal_allowed: { type: Sequelize.STRING, allowNull: false, defaultValue: 'No' },
      color_type: { type: Sequelize.STRING, allowNull: false, defaultValue: 'NORMAL' },
      item_type: { type: Sequelize.STRING, allowNull: false, defaultValue: '1 NORMAL' },
      local_tax: { type: Sequelize.STRING, allowNull: false, defaultValue: 'Taxable' },
      central_tax: { type: Sequelize.STRING, allowNull: false, defaultValue: 'Taxable' },
      rate_a: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      rate_b: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      rate_c: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      cost: { type: Sequelize.DECIMAL(10, 5), allowNull: false, defaultValue: 0 },
      conv_strip: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },
      conv_case: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },
      csr: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      sgst: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      cgst: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      igst: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      allow_negative: { type: Sequelize.STRING, allowNull: false, defaultValue: 'No' },
      more_options: { type: Sequelize.STRING, allowNull: false, defaultValue: 'No' },
    };

    for (const [colName, colDef] of Object.entries(cols)) {
      if (!medInfo[colName]) {
        await queryInterface.addColumn('medicines', colName, colDef);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('medicines');
    await queryInterface.dropTable('hsn_sac');
    await queryInterface.dropTable('salts');
    await queryInterface.dropTable('companies');
  }
};
