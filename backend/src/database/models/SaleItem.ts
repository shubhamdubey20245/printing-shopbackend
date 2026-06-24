import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class SaleItem extends Model {
  declare id: string;
  declare sale_id: string;
  declare medicine_id: string;
  declare quantity: number;
  declare price: number; // Selling price at the time of sale
  declare gst: number;
  declare total: number;
  declare purchase_price_snapshot: number;
  declare discount_snapshot: number;
  declare profit_snapshot: number;
  declare free_qty: number;
  declare notes?: string;

  static associate(models: any) {
    SaleItem.belongsTo(models.Sale, { foreignKey: 'sale_id' });
    SaleItem.belongsTo(models.Medicine, { foreignKey: 'medicine_id', as: 'medicine' });
    SaleItem.hasMany(models.ReturnItem, { foreignKey: 'sale_item_id' });
  }
}

SaleItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sale_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'sales', key: 'id' }
  },
  medicine_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'medicines', key: 'id' }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  free_qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  gst: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  purchase_price_snapshot: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  discount_snapshot: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  profit_snapshot: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'SaleItem',
  tableName: 'sale_items',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
