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
exports.deleteNews = exports.updateNews = exports.getNewsById = exports.getAllNews = exports.createNews = void 0;
const news_service_1 = require("../services/news.service");
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const news = yield (0, news_service_1.createNewsService)(content, image);
        res.status(201).json({
            success: true,
            message: 'Yangilik muvaffaqiyatli yaratildi',
            data: news,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Xatolik yaratishda',
            error: err,
        });
    }
});
exports.createNews = createNews;
const getAllNews = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const news = yield (0, news_service_1.getAllNewsService)();
    res.json({
        success: true,
        message: 'Barcha yangiliklar',
        data: news,
    });
});
exports.getAllNews = getAllNews;
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const news = yield (0, news_service_1.getNewsByIdService)(id);
    if (!news) {
        return res.status(404).json({
            success: false,
            message: 'Yangilik topilmadi',
        });
    }
    res.json({
        success: true,
        message: 'Yangilik topildi',
        data: news,
    });
});
exports.getNewsById = getNewsById;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = Number(req.params.id);
        const { content } = req.body;
        const newImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const updated = yield (0, news_service_1.updateNewsService)(id, content, newImage);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Yangilik topilmadi',
            });
        }
        res.json({
            success: true,
            message: 'Yangilik muvaffaqiyatli yangilandi',
            data: updated,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Xatolik yangilashda',
            error: err,
        });
    }
});
exports.updateNews = updateNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield (0, news_service_1.deleteNewsService)(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Yangilik topilmadi',
            });
        }
        res.json({
            success: true,
            message: 'Yangilik o‘chirildi',
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Xatolik o‘chirishda',
            error: err,
        });
    }
});
exports.deleteNews = deleteNews;
