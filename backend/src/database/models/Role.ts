import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Role extends Model {
  declare id: string;
  declare tenant_id: string | null; // null for system-wide roles like SUPER_ADMIN
  declare name: string;
  declare description?: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Role.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Role.belongsToMany(models.Permission, { through: models.RolePermission, foreignKey: 'role_id' });
    Role.belongsToMany(models.User, { through: models.UserRole, foreignKey: 'role_id' });
  }
}

Role.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'tenants', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
