import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { Tenant } from './Tenant';

export class User extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare is_active: boolean;
  declare last_login?: Date;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    User.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    User.belongsToMany(models.Role, { through: models.UserRole, foreignKey: 'user_id' });
    // Audit relationships (Optional, but good for completeness if we ever do user.getSales())
    User.hasMany(models.Sale, { foreignKey: 'created_by' });
    User.hasMany(models.InventoryTransaction, { foreignKey: 'created_by' });
    User.hasMany(models.PurchaseOrder, { foreignKey: 'created_by' });
    User.hasMany(models.Return, { foreignKey: 'created_by' });
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'STAFF',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});


