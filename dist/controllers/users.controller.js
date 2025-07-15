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
exports.deleteUser = exports.updateUser = exports.findUserById = exports.findAllUsers = exports.createUser = void 0;
const users_service_1 = require("../services/users.service");
const usersService = new users_service_1.UsersService();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield usersService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
});
exports.createUser = createUser;
const findAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield usersService.findAll();
    res.json(result);
});
exports.findAllUsers = findAllUsers;
const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield usersService.findOne(+req.params.id);
    res.status(result.success ? 200 : 404).json(result);
});
exports.findUserById = findUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield usersService.update(+req.params.id, req.body);
    res.status(result.success ? 200 : 404).json(result);
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield usersService.delete(+req.params.id);
    res.status(result.success ? 200 : 404).json(result);
});
exports.deleteUser = deleteUser;
