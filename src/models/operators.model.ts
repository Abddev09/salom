import { DataTypes, Model, HasManyGetAssociationsMixin, Optional } from 'sequelize';
import sequelize from '../config/db';
import { User } from './users.model';

interface OperatorAttributes {
  id: number;
  name: string;
  slug: string;
  link?: string;
  referalCount: number;
}

export class Operator extends Model<OperatorAttributes, Optional<OperatorAttributes, 'id' | 'link' | 'referalCount'>> implements OperatorAttributes {

  public id!: number;
  public name!: string;
  public slug!: string;
  public link?: string;
  public referalCount!: number;
  public users?: User[];
  public getUsers!: HasManyGetAssociationsMixin<User>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Operator.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referalCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
   
  },
  {
    sequelize,
    modelName: 'Operator',
    tableName: 'operators',
    timestamps: true,
    updatedAt: false,
  }
);

