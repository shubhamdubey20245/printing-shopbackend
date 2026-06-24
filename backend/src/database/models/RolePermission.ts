import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class RolePermission extends Model {
  declare role_id: string;
  declare permission_id: string;
}

RolePermission.init({
  role_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: 'roles', key: 'id' },
    onDelete: 'CASCADE'
  },
  permission_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: 'permissions', key: 'id' },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  tableName: 'role_permissions',
  timestamps: false,
});
