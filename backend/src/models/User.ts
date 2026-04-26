import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: 'student' | 'secretary' | 'admin';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
  hooks: {
    beforeCreate: async (user) => {
      const plainPassword = user.getDataValue('password') as string;
      if (plainPassword) {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        user.setDataValue('password', hashedPassword);
      }
    },
  },
});

export default User;

