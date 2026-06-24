import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Return extends Model {
  declare id: string;
  declare tenant_id: string;
  declare sale_id: string;
  declare return_date: Date;
  declare total_refund_amount: number;
  declare reason?: string;
  declare created_by: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Return.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Return.belongsTo(models.Sale, { foreignKey: 'sale_id' });
    Return.belongsTo(models.User, { foreignKey: 'created_by' });
    Return.hasMany(models.ReturnItem, { foreignKey: 'return_id', as: 'items' });
  }
}

Return.init({
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
  sale_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'sales', key: 'id' }
  },
  return_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  total_refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  sequelize,
  tableName: 'returns',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
