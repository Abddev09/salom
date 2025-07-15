import { DataTypes, Model, HasManyGetAssociationsMixin, Optional } from 'sequelize';
import sequelize from '../config/db';

interface NewsAttributes {
  id: number;
  image?: string;
  content: string;
}

export class News extends Model<NewsAttributes, Optional<NewsAttributes, 'id'>> implements NewsAttributes {

  public id!: number;
  public image?: string;
  public content!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

News.init(
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},
{
  sequelize,
  tableName: 'news',
  timestamps: true,
  underscored: true,
  modelName: 'News',
  schema: 'public',
  hooks: {
    beforeCreate: (news: News) => {
      news.createdAt = new Date();
      news.updatedAt = new Date();
    },
    beforeUpdate: (news: News) => {
      news.updatedAt = new Date();
    },
  },
});