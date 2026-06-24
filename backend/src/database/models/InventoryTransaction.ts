import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class InventoryTransaction extends Model {
  declare id: string;
  declare tenant_id: string;
  declare medicine_id: string;
  declare transaction_type: string; // 'IN', 'OUT', 'SALE', 'ADJUSTMENT', 'RETURN'
  declare quantity: number; // Can be positive (IN) or negative (OUT)
  declare reference_id?: string; // e.g., sale_id or purchase_id
  declare created_by: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  static associate(models: any) {
    InventoryTransaction.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    InventoryTransaction.belongsTo(models.User, { foreignKey: 'created_by' });
    InventoryTransaction.belongsTo(models.Medicine, { foreignKey: 'medicine_id' });
  }
}

InventoryTransaction.init({
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
  medicine_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'medicines', key: 'id' }
  },
  transaction_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  sequelize,
  modelName: 'InventoryTransaction',
  tableName: 'inventory_transactions',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
