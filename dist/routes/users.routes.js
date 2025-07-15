"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../controllers/users.controller");
const router = express_1.default.Router();
router.post('/', users_controller_1.createUser);
router.get('/', users_controller_1.findAllUsers);
router.get('/:id', users_controller_1.findUserById);
router.patch('/:id', users_controller_1.updateUser);
router.delete('/:id', users_controller_1.deleteUser);
exports.default = router;
