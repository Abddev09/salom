"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// models/user.model.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chatId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    additionalPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    utmTag: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    applicationDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "pending",
    },
}, {
    sequelize: db_1.default,
    modelName: "User",
    tableName: "user",
    timestamps: true,
    updatedAt: false,
});
