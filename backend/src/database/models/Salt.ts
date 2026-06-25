import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Salt extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Salt.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Salt.hasMany(models.Medicine, { foreignKey: 'salt_id' });
  }
}

Salt.init({
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
  }
}, {
  sequelize,
  modelName: 'Salt',
  tableName: 'salts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
