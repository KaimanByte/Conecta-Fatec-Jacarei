import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

export type UserRole = 'student' | 'secretary' | 'admin';

class User extends Model<InferAttributes<User, { omit: 'createdAt' | 'updatedAt' }>, InferCreationAttributes<User, { omit: 'createdAt' | 'updatedAt' }>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare role: CreationOptional<UserRole>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'secretary', 'admin'),
    allowNull: false,
    defaultValue: 'student',
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  indexes: [
    {
      name: 'idx_users_email',
      unique: true,
      fields: ['email'],
    },
  ],
  hooks: {
    beforeCreate: async (user: User) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

export default User;
