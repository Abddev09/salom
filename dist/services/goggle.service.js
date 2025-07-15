"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.GoogleService = void 0;
const googleapis_1 = require("googleapis");
const dotenv = __importStar(require("dotenv"));
const date_fns_1 = require("date-fns");
dotenv.config();
class GoogleService {
    constructor() {
        var _a;
        const credentials = {
            type: process.env.GOOGLE_TYPE,
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
            private_key: (_a = process.env.GOOGLE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
            auth_uri: process.env.GOOGLE_AUTH_URI,
            token_uri: process.env.GOOGLE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
            client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
            universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
        };
        this.spreadsheetId = process.env.SPREADSHEET_ID;
        const auth = new googleapis_1.google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.sheets = googleapis_1.google.sheets({ version: 'v4', auth });
    }
    ensureSheetExists(sheetTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: this.spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                addSheet: {
                                    properties: {
                                        title: sheetTitle,
                                    },
                                },
                            },
                        ],
                    },
                });
            }
            catch (e) {
                // Sheet mavjud bo‘lsa, jim
            }
        });
    }
    clearSheet(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sheets.spreadsheets.values.clear({
                    spreadsheetId: this.spreadsheetId,
                    range: `${sheetName}!A:Z`,
                });
            }
            catch (e) {
                // Sheet topilmasa jim
            }
        });
    }
    writeUsersToSheet(sheetTitle_1, users_1) {
        return __awaiter(this, arguments, void 0, function* (sheetTitle, users, includeReferrer = false) {
            yield this.ensureSheetExists(sheetTitle);
            yield this.clearSheet(sheetTitle);
            const headers = ['#', 'F.I.Sh.', 'Telefon', 'Qo‘shimcha tel', 'Telegram', 'Link', 'Status', 'Ariza vaqti'];
            if (includeReferrer)
                headers.push('Referrer Operator');
            const values = [
                headers,
                ...users.map((user, i) => {
                    var _a;
                    const formattedDate = user.applicationDate
                        ? (0, date_fns_1.format)(new Date(user.applicationDate), 'yyyy-MM-dd HH:mm')
                        : '';
                    const row = [
                        i + 1,
                        user.fullName || '',
                        user.phone || '',
                        user.additionalPhone || '',
                        user.username || '',
                        user.utmTag || '',
                        user.status || '',
                        formattedDate,
                    ];
                    if (includeReferrer) {
                        row.push(((_a = user.referrerOperator) === null || _a === void 0 ? void 0 : _a.name) || '');
                    }
                    return row;
                }),
            ];
            yield this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `${sheetTitle}!A1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values,
                },
            });
        });
    }
}
exports.GoogleService = GoogleService;
