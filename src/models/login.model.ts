import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface LoginAttributes {
  id: number;
  username: string;
  password: string;
}

type LoginCreationAttributes = Optional<LoginAttributes, 'id'>;

export class Login extends Model<LoginAttributes, LoginCreationAttributes> implements LoginAttributes {
  public id!: number;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Login.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Login',
    tableName: 'login', // ✅ shart emas, agar modelName to‘g‘ri bo‘lsa
    timestamps: true,
  }
);
