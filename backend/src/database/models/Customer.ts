import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Customer extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare phone: string;
  declare email?: string;
  declare address?: string;
  declare type: string;
  declare age?: number;
  declare gender?: string;
  declare discount_percent: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Customer.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Customer.hasMany(models.Sale, { foreignKey: 'customer_id' });
  }
}

Customer.init({
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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'regular',
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discount_percent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Customer',
  tableName: 'customers',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
