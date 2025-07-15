"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Operator extends sequelize_1.Model {
}
exports.Operator = Operator;
Operator.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    referalCount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize: db_1.default,
    modelName: 'Operator',
    tableName: 'operators',
    timestamps: true,
    updatedAt: false,
});
