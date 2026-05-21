import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database.js';
import Inquiry from './Inquiry.js';

export type SatisfactionStatus = 'ATENDEU' | 'NAO_ATENDEU';

class InteractionLog extends Model<InferAttributes<InteractionLog, { omit: 'createdAt' }>, InferCreationAttributes<InteractionLog, { omit: 'createdAt' }>> {
  declare id: CreationOptional<number>;
  declare sessionId: CreationOptional<string>;
  declare navigationFlow: CreationOptional<number[]>;
  declare inquiryId: ForeignKey<Inquiry['id']> | null;
  declare satisfaction: SatisfactionStatus | null;
  declare readonly createdAt: CreationOptional<Date>;
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

InteractionLog.belongsTo(Inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
Inquiry.hasMany(InteractionLog, { foreignKey: 'inquiryId', as: 'interactionLogs' });

export default InteractionLog;
