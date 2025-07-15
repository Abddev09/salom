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
exports.deleteNewsService = exports.updateNewsService = exports.getNewsByIdService = exports.getAllNewsService = exports.createNewsService = exports.cleanHtmlForTelegram = void 0;
const news_model_1 = require("../models/news.model");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const models_1 = require("../models");
const bot_1 = __importDefault(require("../bot"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
const cleanHtmlForTelegram = (rawHtml) => {
    const prepared = rawHtml
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/gi, '\n')
        .replace(/<p>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<div>/gi, '\n')
        .replace(/<\/div>/gi, '\n');
    return (0, sanitize_html_1.default)(prepared, {
        allowedTags: ['b', 'i', 'u', 's', 'a', 'code', 'pre'], // faqat Telegram ruxsat etganlar
        allowedAttributes: {
            a: ['href'],
        },
        transformTags: {
            strong: 'b',
            em: 'i',
            span: '\n',
            h1: 'b',
            h2: 'b',
            h3: 'b',
            h4: 'b',
            h5: 'b',
            h6: 'b',
            // Optional: <p> yoki <div> ni <b> ga aylantirish (agar yuqorida replace ishlamasa)
            p: '\n',
            div: '\n',
        },
        textFilter: (text) => text
            .replace(/ +/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim(),
    });
};
exports.cleanHtmlForTelegram = cleanHtmlForTelegram;
const createNewsService = (content, image) => __awaiter(void 0, void 0, void 0, function* () {
    const news = yield news_model_1.News.create({ content, image });
    const messageText = `${news.content}`;
    const sentChatIds = new Set();
    if (messageText.length > 1024) {
        return {
            success: false,
            error: "Message caption uzunligi 1024 ta belgidan oshmasligi kerak (Telegram limit). Iltimos, qisqartiring.",
        };
    }
    try {
        const users = yield models_1.User.findAll();
        for (const user of users) {
            const chatId = Number(user.chatId);
            if (!chatId || sentChatIds.has(chatId))
                continue;
            sentChatIds.add(chatId);
            if (news.image) {
                const imagePath = path_1.default.join(uploadsDir, news.image);
                if (fs_1.default.existsSync(imagePath)) {
                    console.log("📸 Sending image from:", imagePath);
                    yield bot_1.default.sendPhoto(chatId, fs_1.default.createReadStream(imagePath), {
                        caption: (0, exports.cleanHtmlForTelegram)(news.content),
                        parse_mode: "HTML",
                    });
                }
                else {
                    console.warn("⚠️ Image topilmadi:", imagePath);
                }
            }
        }
    }
    catch (err) {
        console.error("❌ Telegramga yuborishda xatolik:", err);
        return {
            success: false,
            error: "Telegramga yuborishda xatolik yuz berdi.",
        };
    }
    return {
        success: true,
        data: news,
    };
});
exports.createNewsService = createNewsService;
const getAllNewsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield news_model_1.News.findAll({ order: [['createdAt', 'DESC']] });
});
exports.getAllNewsService = getAllNewsService;
const getNewsByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield news_model_1.News.findByPk(id);
});
exports.getNewsByIdService = getNewsByIdService;
const updateNewsService = (id, content, newImage) => __awaiter(void 0, void 0, void 0, function* () {
    const news = yield news_model_1.News.findByPk(id);
    if (!news)
        return null;
    // Eski rasmni o‘chirish
    if (newImage && news.image) {
        const oldPath = path_1.default.join(uploadsDir, news.image);
        if (fs_1.default.existsSync(oldPath))
            fs_1.default.unlinkSync(oldPath);
    }
    news.content = content;
    if (newImage)
        news.image = newImage;
    yield news.save();
    return news;
});
exports.updateNewsService = updateNewsService;
const deleteNewsService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const news = yield news_model_1.News.findByPk(id);
    if (!news)
        return null;
    if (news.image) {
        const imagePath = path_1.default.join(uploadsDir, news.image);
        if (fs_1.default.existsSync(imagePath))
            fs_1.default.unlinkSync(imagePath);
    }
    yield news.destroy();
    return news;
});
exports.deleteNewsService = deleteNewsService;
