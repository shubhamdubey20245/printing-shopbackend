import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Supplier extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare contact_person?: string;
  declare phone?: string;
  declare email?: string;
  declare address?: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Supplier.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Supplier.hasMany(models.PurchaseOrder, { foreignKey: 'supplier_id' });
  }
}

Supplier.init({
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_person: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'suppliers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
