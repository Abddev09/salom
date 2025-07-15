"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = exports.Login = exports.Operator = exports.User = exports.sequelize = exports.initDb = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.sequelize = db_1.default;
const users_model_1 = require("./users.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return users_model_1.User; } });
const operators_model_1 = require("./operators.model");
Object.defineProperty(exports, "Operator", { enumerable: true, get: function () { return operators_model_1.Operator; } });
const login_model_1 = require("./login.model");
Object.defineProperty(exports, "Login", { enumerable: true, get: function () { return login_model_1.Login; } });
const news_model_1 = require("./news.model");
Object.defineProperty(exports, "News", { enumerable: true, get: function () { return news_model_1.News; } });
// Bog‘lashlar
users_model_1.User.belongsTo(operators_model_1.Operator, {
    as: 'referrerOperator',
    foreignKey: 'referrerOperatorId',
    onDelete: 'SET NULL',
});
operators_model_1.Operator.hasMany(users_model_1.User, {
    as: 'users',
    foreignKey: 'referrerOperatorId',
    onDelete: 'SET NULL',
});
// 🔁 Model sync
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.sync({ alter: true }); // yoki { force: true } agar boshlang'ich bo‘lsa
        console.log('✅ All models synced');
    }
    catch (err) {
        console.error('❌ Sequelize sync error:', err);
    }
});
exports.initDb = initDb;
