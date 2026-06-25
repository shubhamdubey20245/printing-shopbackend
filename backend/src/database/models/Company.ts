import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Company extends Model {
  declare id: string;
  declare tenant_id: string;
  declare name: string;
  declare order_form_pref: number;
  declare invoice_printing_pref: number;
  declare dump_days: number;
  declare expiry_receive_upto: number;
  declare minimum_margin: number;
  declare sales_tax: number;
  declare sales_tax_cess: number;
  declare purchase_tax: number;
  declare purchase_tax_cess: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Company.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Company.hasMany(models.Medicine, { foreignKey: 'company_id' });
  }
}

Company.init({
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
  order_form_pref: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  invoice_printing_pref: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  dump_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
  },
  expiry_receive_upto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 90,
  },
  minimum_margin: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  sales_tax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  sales_tax_cess: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  purchase_tax: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  },
  purchase_tax_cess: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  }
}, {
  sequelize,
  modelName: 'Company',
  tableName: 'companies',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
