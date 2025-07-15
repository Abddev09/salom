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
exports.OperatorService = void 0;
const operators_model_1 = require("../models/operators.model");
const users_model_1 = require("../models/users.model");
const slug_1 = require("../utils/slug");
const goggle_service_1 = require("./goggle.service");
const googleService = new goggle_service_1.GoogleService();
class OperatorService {
    create(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = (0, slug_1.generateSlug)(name);
            const operator = yield operators_model_1.Operator.create({
                name,
                slug,
                link: (0, slug_1.generateLink)(slug),
            });
            yield googleService.ensureSheetExists('All_Users');
            yield googleService.ensureSheetExists(slug);
            return {
                success: true,
                message: 'Operator muvaffaqiyatli yaratildi',
                data: operator,
            };
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const operators = yield operators_model_1.Operator.findAll({
                include: [{ model: users_model_1.User, as: 'users', include: ['referrerOperator'] }],
                limit: 1000,
            });
            const allUsers = operators.flatMap(op => {
                var _a;
                return ((_a = op.users) !== null && _a !== void 0 ? _a : []).map(user => (Object.assign(Object.assign({}, user.toJSON()), { referrerOperator: user.referrerOperator })));
            });
            yield googleService.writeUsersToSheet('All_Users', allUsers, true);
            for (const operator of operators) {
                const ownUsers = ((_a = operator.users) !== null && _a !== void 0 ? _a : []).filter(user => user.utmTag === operator.link);
                yield googleService.writeUsersToSheet((0, slug_1.generateSlug)(operator.name), ownUsers);
            }
            return {
                success: true,
                message: `Topildi: ${operators.length} operator`,
                data: operators,
            };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const operator = yield operators_model_1.Operator.findByPk(id, {
                include: [{ model: users_model_1.User, as: 'users', include: ['referrerOperator'] }],
            });
            if (!operator) {
                return {
                    success: false,
                    message: `ID: ${id} bo‘yicha operator topilmadi`,
                };
            }
            return {
                success: true,
                message: 'Operator va foydalanuvchilari topildi',
                data: operator,
            };
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const operator = yield operators_model_1.Operator.findByPk(id);
            if (!operator) {
                return {
                    success: false,
                    message: `ID: ${id} bo‘yicha operator topilmadi`,
                };
            }
            if (data.name) {
                const slug = (0, slug_1.generateSlug)(data.name);
                operator.slug = slug;
                operator.link = (0, slug_1.generateLink)(slug);
            }
            Object.assign(operator, data);
            yield operator.save();
            return {
                success: true,
                message: `Operator ID: ${id} muvaffaqiyatli yangilandi`,
                data: operator,
            };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield operators_model_1.Operator.destroy({ where: { id } });
            if (!deleted) {
                return {
                    success: false,
                    message: `ID: ${id} bo‘yicha operator topilmadi`,
                };
            }
            return {
                success: true,
                message: `Operator ID: ${id} o‘chirildi`,
            };
        });
    }
}
exports.OperatorService = OperatorService;
