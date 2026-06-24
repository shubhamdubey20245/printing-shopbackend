import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class Sale extends Model {
  declare id: string;
  declare tenant_id: string;
  declare invoice_number: string;
  declare customer_name?: string;
  declare customer_phone?: string;
  declare customer_id?: string;
  declare subtotal: number;
  declare gst_amount: number;
  declare discount: number;
  declare additional_charges: number;
  declare total_amount: number;
  declare payment_method: string;
  declare status: string;
  declare created_by: string;

  // Pharmacy fields
  declare patient_age?: number;
  declare patient_gender?: string;
  declare patient_address?: string;
  declare doctor_id?: string;
  declare doctor_name?: string;
  declare doctor_reg_no?: string;
  declare doctor_commission_amount?: number;
  declare prescription_no?: string;
  declare prescription_date?: Date;
  declare prescription_image_url?: string;
  declare notes?: string;
  declare amount_received?: number;
  declare balance_amount?: number;

  declare billing_date?: Date;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    Sale.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Sale.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Sale.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });

    // Sale.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });

    Sale.hasMany(models.SaleItem, { foreignKey: 'sale_id', as: 'items' });
    Sale.hasMany(models.Return, { foreignKey: 'sale_id' });
  }
}

Sale.init({
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
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'customers', key: 'id' }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  gst_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  additional_charges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'CASH', // CASH, UPI, CARD
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'COMPLETED',
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  patient_age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  patient_gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  patient_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctor_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctor_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'doctors', key: 'id' }
  },
  doctor_reg_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctor_commission_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  prescription_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prescription_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  prescription_image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  amount_received: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  balance_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  billing_date: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Sale',
  tableName: 'sales',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
