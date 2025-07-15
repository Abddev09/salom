"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class News extends sequelize_1.Model {
}
exports.News = News;
News.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: 'news',
    timestamps: true,
    underscored: true,
    modelName: 'News',
    schema: 'public',
    hooks: {
        beforeCreate: (news) => {
            news.createdAt = new Date();
            news.updatedAt = new Date();
        },
        beforeUpdate: (news) => {
            news.updatedAt = new Date();
        },
    },
});
