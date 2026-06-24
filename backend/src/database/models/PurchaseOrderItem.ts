import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class PurchaseOrderItem extends Model {
  declare id: string;
  declare purchase_order_id: string;
  declare medicine_id: string;
  declare quantity: number;
  declare price: number; // Purchase price
  declare total: number;

  static associate(models: any) {
    PurchaseOrderItem.belongsTo(models.PurchaseOrder, { foreignKey: 'purchase_order_id' });
    PurchaseOrderItem.belongsTo(models.Medicine, { foreignKey: 'medicine_id' });
  }
}

PurchaseOrderItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  purchase_order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'purchase_orders', key: 'id' },
    onDelete: 'CASCADE'
  },
  medicine_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'medicines', key: 'id' }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'purchase_order_items',
  timestamps: false,
});
