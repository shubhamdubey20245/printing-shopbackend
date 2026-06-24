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
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Medicine.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Medicine.belongsTo(models.Category, { foreignKey: 'category_id' });
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
  }
}, {
  sequelize,
  modelName: 'Medicine',
  tableName: 'medicines',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
