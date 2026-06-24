import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Permission extends Model {
  declare id: string;
  declare name: string; // e.g., 'manage_inventory', 'view_reports'
  declare module: string; // e.g., 'INVENTORY', 'BILLING'
  declare description?: string;

  static associate(models: any) {
    Permission.belongsToMany(models.Role, { through: models.RolePermission, foreignKey: 'permission_id' });
  }
}

Permission.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'permissions',
  timestamps: false,
});
