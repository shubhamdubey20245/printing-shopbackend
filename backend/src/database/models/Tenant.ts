import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Tenant extends Model {
  declare id: string;
  declare name: string;
  declare business_name: string;
  declare gst_number?: string;
  declare subscription_plan: string;
  declare subscription_status: string;
  declare expiry_date?: Date;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Tenant.hasMany(models.Customer, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Medicine, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Sale, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.InventoryTransaction, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Supplier, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.PurchaseOrder, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Role, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Notification, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.TenantSetting, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Return, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.User, { foreignKey: 'tenant_id' });
  }
}

Tenant.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  business_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gst_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subscription_plan: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'FREE',
  },
  subscription_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Tenant',
  tableName: 'tenants',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
