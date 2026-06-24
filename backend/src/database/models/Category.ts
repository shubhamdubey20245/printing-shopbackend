import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Category extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare description?: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Category.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Category.hasMany(models.Medicine, { foreignKey: 'category_id' });
  }
}

Category.init({
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
