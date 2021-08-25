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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
// import mailgun, { Mailgun, Attachment } from 'mailgun-js';
var nodemailer_1 = __importDefault(require("nodemailer"));
var handlebars_1 = __importDefault(require("handlebars"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var constants_1 = require("../models/constants");
var EmailController = /** @class */ (function () {
    function EmailController() {
        this.mg = nodemailer_1.default.createTransport({
            host: constants_1.CONFIG.MAIL.HOST,
            port: constants_1.CONFIG.MAIL.PORT,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: constants_1.CONFIG.MAIL.EMAIL_FROM,
                clientId: constants_1.CONFIG.MAIL.CLIENT_ID,
                clientSecret: constants_1.CONFIG.MAIL.CLIENT_SECRET,
                refreshToken: constants_1.CONFIG.MAIL.REFRESH_TOEKN
            }
        });
    }
    EmailController.prototype.sendMailgunTemplate = function (_a) {
        var templateName = _a.templateName, to = _a.to, cc = _a.cc, params = _a.params, language = _a.language, attachments = _a.attachments;
        return __awaiter(this, void 0, void 0, function () {
            var _subject, _template, data, response;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!language)
                            language = 'en';
                        try {
                            _template = constants_1.TEMPLATES[language][templateName]['template'];
                            _subject = constants_1.TEMPLATES[language][templateName]['subject'].replace(/{{.?clientName.?}}/ig, params.clientName);
                        }
                        catch (e) {
                            throw e;
                        }
                        data = {
                            from: constants_1.CONFIG.MAIL.EMAIL_FROM,
                            to: to,
                            subject: _subject,
                            template: _template,
                            text: JSON.stringify(params),
                            attachment: attachments
                        };
                        if (cc)
                            data.cc = cc;
                        return [4 /*yield*/, (new Promise(function (resolve, reject) {
                                _this.mg.sendMail(data, function (error, info) {
                                    if (error) {
                                        reject(error);
                                    }
                                    else {
                                        resolve('Email sent: ' + info.response);
                                    }
                                });
                                // this.mg.messages().send(data, (err, body) => {
                                // 	if (err) reject(err);
                                // 	else resolve(body);
                                // });
                            }))];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmailController.prototype.sendUserResetPasswordEmail = function (_a) {
        var user = _a.user, resetToken = _a.resetToken;
        return __awaiter(this, void 0, void 0, function () {
            var resetPasswordURL;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        resetPasswordURL = constants_1.CONFIG.ENVIRONMENT_CONFIG.ADMIN_URL + "/account/resetpassword/" + resetToken;
                        return [4 /*yield*/, this.sendMailgunTemplate({
                                templateName: 'forgotpassword',
                                to: user.email,
                                language: user.langPref,
                                params: {
                                    resetPasswordURL: resetPasswordURL
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmailController.prototype.readHTMLFile = function (path, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                fs_1.default.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    else {
                        callback(null, html);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ;
    EmailController.prototype.send = function (_subject, detail, to, cc, filename, resetToken) {
        return __awaiter(this, void 0, void 0, function () {
            var resetPasswordURL, transporter, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resetPasswordURL = constants_1.CONFIG.ENVIRONMENT_CONFIG.ADMIN_URL + "/setpassword/" + resetToken;
                        transporter = nodemailer_1.default.createTransport({
                            host: constants_1.CONFIG.MAIL.HOST,
                            port: constants_1.CONFIG.MAIL.PORT,
                            secure: true,
                            auth: {
                                type: 'OAuth2',
                                user: constants_1.CONFIG.MAIL.EMAIL_FROM,
                                clientId: constants_1.CONFIG.MAIL.CLIENT_ID,
                                clientSecret: constants_1.CONFIG.MAIL.CLIENT_SECRET,
                                refreshToken: constants_1.CONFIG.MAIL.REFRESH_TOEKN
                            }
                        });
                        return [4 /*yield*/, (new Promise(function (resolve, reject) {
                                _this.readHTMLFile(path_1.default.dirname(constants_1.CONFIG.ROOT_FILE) + "/template/" + filename, function (err, html) {
                                    var template = handlebars_1.default.compile(html);
                                    // logoUrl: 'http://52.54.42.5:8187/images/logo.png',
                                    var replacements = {
                                        logoUrl: '',
                                        url: resetPasswordURL,
                                        // token: resetToken,
                                        message: !detail.message ? '' : detail.message,
                                        heading: !detail.heading ? '' : detail.heading,
                                        payorEmail: !detail.payorEmail ? '' : detail.payorEmail,
                                        email: !to ? '' : to,
                                        firstName: !detail.firstName ? '' : detail.firstName,
                                        lastName: !detail.lastName ? '' : detail.lastName,
                                        role: !detail.role ? '' : detail.role,
                                        code: !detail.code ? '' : detail.code,
                                        name: !detail.name ? '' : detail.name,
                                        phone: !detail.phone ? '' : detail.phone,
                                        phone_1: !detail.phone_1 ? '' : detail.phone_1,
                                        phone_2: !detail.phone_2 ? '' : detail.phone_2,
                                        comment: !detail.comment ? '' : detail.comment,
                                        contact: !detail.contact ? '' : detail.contact,
                                        industry: !detail.industry ? '' : detail.industry,
                                        amount: !detail.amount ? 0 : detail.amount,
                                        title: !detail.title ? '' : detail.title,
                                        startDate: !detail.startDate ? '' : detail.startDate,
                                        summary: !detail.summary ? '' : detail.summary,
                                        documentUrl: !detail.documentUrl ? '' : detail.documentUrl,
                                        members: !detail.members ? [] : detail.members.length > 0 ? JSON.stringify(detail.members) : []
                                    };
                                    var htmlToSend = template(replacements);
                                    var data = {
                                        from: constants_1.CONFIG.MAIL.EMAIL_FROM,
                                        to: to,
                                        cc: cc,
                                        subject: _subject,
                                        html: htmlToSend,
                                    };
                                    transporter.sendMail(data, function (error, info) {
                                        if (error) {
                                            reject(error);
                                        }
                                        else {
                                            resolve('Email sent: ' + info.response);
                                        }
                                    });
                                });
                            }))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return EmailController;
}());
exports.EmailController = EmailController;
exports.default = new EmailController();
