import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class TenantSetting extends Model {
  declare id: string;
  declare tenant_id: string;
  declare key: string; // e.g., 'INVOICE_PREFIX', 'THEME_COLOR'
  declare value: string;
  declare type: string; // 'STRING', 'BOOLEAN', 'JSON'
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    TenantSetting.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
  }
}

TenantSetting.init({
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
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'STRING',
  }
}, {
  sequelize,
  tableName: 'tenant_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['tenant_id', 'key']
    }
  ]
});
