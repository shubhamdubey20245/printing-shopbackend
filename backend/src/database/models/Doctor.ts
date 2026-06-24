import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Doctor extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare phone: string;
  declare reg_no?: string;
  declare commission_percent: number;
  declare address?: string;
  declare speciality?: string;
  declare qualification?: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Doctor.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Doctor.hasMany(models.Sale, { foreignKey: 'doctor_id' });
  }
}

Doctor.init({
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
  reg_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commission_percent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  speciality: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Doctor',
  tableName: 'doctors',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
