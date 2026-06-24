import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class ReturnItem extends Model {
  declare id: string;
  declare return_id: string;
  declare sale_item_id: string;
  declare medicine_id: string;
  declare quantity: number;
  declare refund_amount: number;

  static associate(models: any) {
    ReturnItem.belongsTo(models.Return, { foreignKey: 'return_id' });
    ReturnItem.belongsTo(models.SaleItem, { foreignKey: 'sale_item_id' });
    ReturnItem.belongsTo(models.Medicine, { foreignKey: 'medicine_id' });
  }
}

ReturnItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  return_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'returns', key: 'id' },
    onDelete: 'CASCADE'
  },
  sale_item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'sale_items', key: 'id' }
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
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'return_items',
  timestamps: false,
});
