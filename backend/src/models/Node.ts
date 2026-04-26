import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Node extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public parentId?: number;
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
  },
  parentId: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'Node',
});

Node.belongsTo(Node, { foreignKey: 'parentId', as: 'parent' });
Node.hasMany(Node, { foreignKey: 'parentId', sourceKey: 'id', as: 'children' });

export default Node;

