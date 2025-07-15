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
exports.AuthService = void 0;
const login_model_1 = require("../models/login.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    register(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield login_model_1.Login.findOne({ where: { username } });
            if (existingUser) {
                return { success: false, message: 'Foydalanuvchi mavjud' };
            }
            const hashed = yield bcrypt_1.default.hash(password, 10);
            const user = yield login_model_1.Login.create({ username, password: hashed });
            return { success: true, message: 'Ro‘yxatdan o‘tdi', data: { id: user.id, username: user.username } };
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield login_model_1.Login.findOne({ where: { username } });
            if (!user)
                return { success: false, message: 'Foydalanuvchi topilmadi' };
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (!match)
                return { success: false, message: 'Parol noto‘g‘ri' };
            return { success: true, message: 'Muvaffaqiyatli login', data: { id: user.id, username: user.username } };
        });
    }
}
exports.AuthService = AuthService;
