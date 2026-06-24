import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class PurchaseOrder extends Model {
  declare id: string;
  declare tenant_id: string;
  declare supplier_id: string;
  declare order_date: Date;
  declare status: string; // 'PENDING', 'RECEIVED', 'CANCELLED'
  declare total_amount: number;
  declare created_by: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    PurchaseOrder.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    PurchaseOrder.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    PurchaseOrder.belongsTo(models.User, { foreignKey: 'created_by' });
    PurchaseOrder.hasMany(models.PurchaseOrderItem, { foreignKey: 'purchase_order_id', as: 'items' });
  }
}

PurchaseOrder.init({
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
  supplier_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'suppliers', key: 'id' }
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING',
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  sequelize,
  tableName: 'purchase_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
