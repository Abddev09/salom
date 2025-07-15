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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const users_model_1 = require("../models/users.model");
const operators_model_1 = require("../models/operators.model");
const goggle_service_1 = require("./goggle.service");
const googleService = new goggle_service_1.GoogleService();
class UsersService {
    create(userDto) {
        return __awaiter(this, void 0, void 0, function* () {
            let operator = null;
            if (userDto.utmTag) {
                operator = yield operators_model_1.Operator.findOne({ where: { link: userDto.utmTag } });
                if (!operator) {
                    return {
                        success: false,
                        message: 'Ushbu havola (utmTag) orqali operator topilmadi',
                    };
                }
                userDto.referrerOperatorId = operator.id;
                userDto.utmTag = operator.link;
                operator.referalCount++;
                yield operator.save();
            }
            const user = yield users_model_1.User.create(userDto);
            const allUsers = yield users_model_1.User.findAll({
                include: ['referrerOperator'],
                limit: 1000,
            });
            yield googleService.writeUsersToSheet('All_Users', allUsers, true);
            if (operator) {
                const operatorUsers = yield users_model_1.User.findAll({
                    where: { utmTag: operator.link },
                    include: ['referrerOperator'],
                });
                const sheetName = operator.name.replace(/\s+/g, '_');
                yield googleService.writeUsersToSheet(sheetName, operatorUsers);
            }
            return {
                success: true,
                message: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
            };
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield users_model_1.User.findAll({
                include: ['referrerOperator'],
            });
            return {
                success: true,
                message: 'Foydalanuvchilar ro‘yxati olindi',
                data: users,
            };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.User.findByPk(id);
            if (!user) {
                return {
                    success: false,
                    message: `ID: ${id} bo‘lgan foydalanuvchi topilmadi`,
                };
            }
            return {
                success: true,
                message: `ID: ${id} bo‘lgan foydalanuvchi topildi`,
                data: user,
            };
        });
    }
    update(id, updateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.User.findByPk(id);
            if (!user) {
                return {
                    success: false,
                    message: `ID: ${id} bo‘lgan foydalanuvchi topilmadi`,
                };
            }
            Object.assign(user, updateDto);
            yield user.save();
            return {
                success: true,
                message: `ID: ${id} bo‘lgan foydalanuvchi yangilandi`,
                data: user,
            };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.User.findByPk(id);
            if (!user) {
                return {
                    success: false,
                    message: `ID: ${id} bo‘lgan foydalanuvchi topilmadi`,
                };
            }
            yield user.destroy();
            return {
                success: true,
                message: `ID: ${id} bo‘lgan foydalanuvchi o‘chirildi`,
            };
        });
    }
}
exports.UsersService = UsersService;
