import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Medicine extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare generic_name?: string;
  declare manufacturer?: string;
  declare barcode?: string;
  declare batch_number: string;
  declare purchase_price: number;
  declare selling_price: number;
  declare mrp: number;
  declare gst_percentage: number;
  declare stock_quantity: number;
  declare minimum_stock: number;
  declare expiry_date: Date;
  declare category_id?: string;

  // Marg ERP Specific Fields
  declare status: string;
  declare type: string;
  declare hide: string;
  declare packing?: string;
  declare unit_1st?: string;
  declare unit_2nd?: string;
  declare decimal_allowed: string;
  declare color_type: string;
  declare item_type: string;
  declare company_id?: string;
  declare salt_id?: string;
  declare hsn_sac_id?: string;
  declare local_tax: string;
  declare central_tax: string;
  declare rate_a: number;
  declare rate_b: number;
  declare rate_c: number;
  declare cost: number;
  declare conv_strip: number;
  declare conv_case: number;
  declare csr: number;
  declare sgst: number;
  declare cgst: number;
  declare igst: number;
  declare allow_negative: string;
  declare more_options: string;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Medicine.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Medicine.belongsTo(models.Category, { foreignKey: 'category_id' });
    Medicine.belongsTo(models.Company, { foreignKey: 'company_id' });
    Medicine.belongsTo(models.Salt, { foreignKey: 'salt_id' });
    Medicine.belongsTo(models.HsnSac, { foreignKey: 'hsn_sac_id' });
    Medicine.hasMany(models.PurchaseOrderItem, { foreignKey: 'medicine_id' });
    Medicine.hasMany(models.SaleItem, { foreignKey: 'medicine_id' });
    Medicine.hasMany(models.ReturnItem, { foreignKey: 'medicine_id' });
  }
}

Medicine.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' }
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'categories', key: 'id' }
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'companies', key: 'id' }
  },
  salt_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'salts', key: 'id' }
  },
  hsn_sac_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'hsn_sac', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  generic_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  batch_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purchase_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  selling_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  mrp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  gst_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  minimum_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // Marg ERP fields
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'CONTINUE',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'NORMAL',
  },
  hide: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'NO',
  },
  packing: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unit_1st: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'TAB.',
  },
  unit_2nd: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'STRP',
  },
  decimal_allowed: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'No',
  },
  color_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'NORMAL',
  },
  item_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1 NORMAL',
  },
  local_tax: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Taxable',
  },
  central_tax: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Taxable',
  },
  rate_a: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  rate_b: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  rate_c: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 5),
    allowNull: false,
    defaultValue: 0,
  },
  conv_strip: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1,
  },
  conv_case: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1,
  },
  csr: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  sgst: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  cgst: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  igst: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  allow_negative: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'No',
  },
  more_options: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'No',
  }
}, {
  sequelize,
  modelName: 'Medicine',
  tableName: 'medicines',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
