import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

export type InquiryStatus = 'ABERTA' | 'RESPONDIDA';

class Inquiry extends Model<InferAttributes<Inquiry, { omit: 'createdAt' | 'updatedAt' }>, InferCreationAttributes<Inquiry, { omit: 'createdAt' | 'updatedAt' }>> {
  declare id: CreationOptional<number>;
  declare requesterName: string;
  declare requesterEmail: string;
  declare question: string;
  declare status: CreationOptional<InquiryStatus>;
  declare answeredBy: ForeignKey<User['id']> | null;
  declare answerText: string | null;
  declare attachmentName: string | null;
  declare attachmentMime: string | null;
  declare attachmentData: Buffer | null;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Inquiry.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    requesterName: { type: DataTypes.STRING(160), allowNull: false },
    requesterEmail: { type: DataTypes.STRING(160), allowNull: false },
    question: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('ABERTA', 'RESPONDIDA'),
      allowNull: false,
      defaultValue: 'ABERTA',
    },
    answeredBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    answerText: { type: DataTypes.TEXT, allowNull: true },
    attachmentName: { type: DataTypes.STRING(255), allowNull: true },
    attachmentMime: { type: DataTypes.STRING(100), allowNull: true },
    attachmentData: { type: DataTypes.BLOB('long'), allowNull: true },
  },
  {
    sequelize,
    modelName: 'Inquiry',
    tableName: 'inquiries',
    indexes: [
      {
        name: 'idx_inquiries_status',
        fields: ['status'],
      },
      {
        name: 'idx_inquiries_created_at',
        fields: ['createdAt'],
      },
      {
        name: 'idx_inquiries_status_created_at',
        fields: ['status', 'createdAt'],
      },
      {
        name: 'idx_inquiries_answered_by',
        fields: ['answeredBy'],
      },
    ],
  }
);

Inquiry.belongsTo(User, { foreignKey: 'answeredBy', as: 'answerer' });
User.hasMany(Inquiry, { foreignKey: 'answeredBy', as: 'answeredInquiries' });

export default Inquiry;
