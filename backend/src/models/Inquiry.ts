import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Inquiry extends Model {
  public id!: number;
  public requesterName!: string;
  public requesterEmail!: string;
  public question!: string;
  public status!: 'ABERTA' | 'RESPONDIDA';
  public answeredBy?: number;
  public answerText?: string;
  public attachmentName?: string;
  public attachmentMime?: string;
  public attachmentData?: Buffer;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    answeredBy: { type: DataTypes.INTEGER, allowNull: true },
    answerText: { type: DataTypes.TEXT, allowNull: true },
    attachmentName: { type: DataTypes.STRING(255), allowNull: true },
    attachmentMime: { type: DataTypes.STRING(100), allowNull: true },
    attachmentData: { type: DataTypes.BLOB('long'), allowNull: true },
  },
  { sequelize, modelName: 'Inquiry', tableName: 'inquiries' }
);

export default Inquiry;
