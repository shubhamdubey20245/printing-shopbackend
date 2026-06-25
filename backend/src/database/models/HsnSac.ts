import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class HsnSac extends Model {
  declare id: string;
  declare tenant_id: string;
  declare hsn_code: string;
  declare short_name?: string;
  declare sgst: number;
  declare cgst: number;
  declare igst: number;
  declare type: string;
  declare uqc?: string;
  declare cess: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    HsnSac.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    HsnSac.hasMany(models.Medicine, { foreignKey: 'hsn_sac_id' });
  }
}

HsnSac.init({
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
  hsn_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sgst: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  cgst: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  igst: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Goods',
  },
  uqc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cess: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  }
}, {
  sequelize,
  modelName: 'HsnSac',
  tableName: 'hsn_sac',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
