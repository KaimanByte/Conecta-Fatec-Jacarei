import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class InteractionLog extends Model {
  public id!: number;
  public sessionId!: string;
  public navigationFlow!: number[];
  public inquiryId?: number;
  public satisfaction?: 'ATENDEU' | 'NAO_ATENDEU';
  public readonly createdAt!: Date;
}

InteractionLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sessionId: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
    navigationFlow: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    inquiryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'inquiries',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    satisfaction: {
      type: DataTypes.ENUM('ATENDEU', 'NAO_ATENDEU'),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'InteractionLog',
    tableName: 'interaction_logs',
    updatedAt: false,
    indexes: [
      {
        name: 'idx_interaction_logs_session_id',
        fields: ['sessionId'],
      },
      {
        name: 'idx_interaction_logs_created_at',
        fields: ['createdAt'],
      },
      {
        name: 'idx_interaction_logs_inquiry_id',
        fields: ['inquiryId'],
      },
    ],
  }
);

export default InteractionLog;
