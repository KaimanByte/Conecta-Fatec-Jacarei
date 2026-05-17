import sequelize, { connectWithRetry } from '../config/database.js';
import User from './User.js';
import Node from './Node.js';
import Inquiry from './Inquiry.js';
import InteractionLog from './InteractionLog.js';

Inquiry.belongsTo(User, { foreignKey: 'answeredBy', as: 'answerer' });
User.hasMany(Inquiry, { foreignKey: 'answeredBy', as: 'answeredInquiries' });

InteractionLog.belongsTo(Inquiry, { foreignKey: 'inquiryId', as: 'inquiry' });
Inquiry.hasMany(InteractionLog, { foreignKey: 'inquiryId', as: 'interactionLogs' });

export { sequelize, connectWithRetry, User, Node, Inquiry, InteractionLog };
export default sequelize;
