"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const models_1 = require("./models");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/uploads", (0, cors_1.default)(), express_1.default.static(path_1.default.join(__dirname, "../uploads")));
//Routes
app.use("/api", index_1.default);
app.get("/", (req, res) => {
    res.send("Usat register api");
});
(0, models_1.initDb)();
// server and database runnig test
const port = process.env.PORT;
app.listen(port, () => {
    db_1.default.authenticate()
        .then(() => {
        console.log('✅ Database connection successful');
    })
        .catch((error) => {
        console.error('❌ Unable to connect to the database:', error);
    });
    console.log(`Server is running on port ${port}`);
});
