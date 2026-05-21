import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database.js';

class Node extends Model<InferAttributes<Node, { omit: 'createdAt' | 'updatedAt' }>, InferCreationAttributes<Node, { omit: 'createdAt' | 'updatedAt' }>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare content: string | null;
  declare parentId: ForeignKey<Node['id']> | null;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Node.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Nodes',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  sequelize,
  modelName: 'Node',
  indexes: [
    {
      name: 'idx_nodes_parent_id',
      fields: ['parentId'],
    },
    {
      name: 'idx_nodes_title',
      fields: ['title'],
    },
  ],
});

Node.belongsTo(Node, { foreignKey: 'parentId', as: 'parent' });
Node.hasMany(Node, { foreignKey: 'parentId', sourceKey: 'id', as: 'children' });

export default Node;
