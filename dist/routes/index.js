"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_routes_1 = __importDefault(require("./login.routes"));
const operators_routes_1 = __importDefault(require("./operators.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const news_routes_1 = __importDefault(require("./news.routes"));
const router = express_1.default.Router();
router.use('/login', login_routes_1.default);
router.use('/operators', operators_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/news', news_routes_1.default);
exports.default = router;
