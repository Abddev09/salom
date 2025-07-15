// models/user.model.ts
import {
  DataTypes,
  Model,
  Optional,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../config/db";
import { Operator } from "./operators.model";

interface UserAttributes {
  id: number;
  chatId?: string;
  fullName: string;
  phone: string;
  additionalPhone?: string;
  username: string;
  utmTag?: string;
  applicationDate?: Date;
  status: string;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "chatId" | "additionalPhone" | "utmTag" | "applicationDate"
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public chatId?: string;
  public fullName!: string;
  public phone!: string;
  public additionalPhone?: string;
  public username!: string;
  public utmTag?: string;
  public applicationDate?: Date;
  public status!: string;

  // Association: ManyToOne
  public referrerOperator?: Operator;
  public getReferrerOperator!: BelongsToGetAssociationMixin<Operator>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    additionalPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    utmTag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applicationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    timestamps: true,
    updatedAt: false,
  }
);
