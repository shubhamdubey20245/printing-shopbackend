import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Notification extends Model {
  declare id: string;
  declare tenant_id: string;
  declare user_id?: string; // If null, it's a tenant-wide broadcast
  declare type: string; // 'INFO', 'WARNING', 'ERROR', 'SUCCESS'
  declare title: string;
  declare message: string;
  declare is_read: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Notification.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Notification.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
    onDelete: 'CASCADE'
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'INFO',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize,
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
