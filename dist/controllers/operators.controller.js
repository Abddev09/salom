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
exports.OperatorsController = void 0;
const operators_service_1 = require("../services/operators.service");
const operatorService = new operators_service_1.OperatorService();
exports.OperatorsController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const result = yield operatorService.create(name);
            res.status(201).json(result);
        });
    },
    findAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield operatorService.findAll();
            res.json(result);
        });
    },
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            const result = yield operatorService.findById(id);
            res.json(result);
        });
    },
    getOperatorWithUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            const result = yield operatorService.findById(id);
            res.json(result);
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            const result = yield operatorService.update(id, req.body);
            res.json(result);
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            const result = yield operatorService.delete(id);
            res.json(result);
        });
    },
};
