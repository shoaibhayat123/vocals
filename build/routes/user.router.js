"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserRouter = void 0;
var express = __importStar(require("express"));
// middleware
var middleware_1 = require("../middleware");
// controllers
var user_controller_1 = __importDefault(require("../controllers/user.controller"));
var email_controller_1 = __importDefault(require("../controllers/email.controller"));
var oauth_controller_1 = __importDefault(require("../controllers/oauth.controller"));
var enums_1 = require("../models/enums");
var async_wrap_1 = require("../shared/async-wrap");
var errors_1 = require("../errors");
var shared_1 = require("../shared");
var user_model_1 = require("../models/user.model");
var shared_2 = require("../models/shared");
var constants_1 = require("../models/constants");
var service_controller_1 = __importDefault(require("../controllers/service.controller"));
var track_controller_1 = __importDefault(require("../controllers/track.controller"));
var order_controller_1 = __importDefault(require("../controllers/order.controller"));
var UserRouter = /** @class */ (function () {
    function UserRouter(userController, emailController, oAuthController, serviceController, trackController, orderController) {
        this.userController = userController;
        this.emailController = emailController;
        this.oAuthController = oAuthController;
        this.serviceController = serviceController;
        this.trackController = trackController;
        this.orderController = orderController;
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    UserRouter.prototype.middleware = function () { };
    UserRouter.prototype.getLoginUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var decodedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, shared_1.me(req, res)];
                    case 1:
                        decodedToken = _a.sent();
                        if (decodedToken === null) {
                            res.status(401).send(new errors_1.UnauthorizedError("Invalid Token", {
                                message: "Invalid Token",
                                i18n: 'invalidToken'
                            }));
                        }
                        return [2 /*return*/, decodedToken.data];
                }
            });
        });
    };
    UserRouter.prototype.dashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users, services, tracks, orders, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.userController.getCountOfUsers()];
                    case 1:
                        users = _a.sent();
                        if (users === null) {
                            users = [0];
                        }
                        return [4 /*yield*/, this.serviceController.getCountOfServices()];
                    case 2:
                        services = _a.sent();
                        if (services === null) {
                            services = [0];
                        }
                        return [4 /*yield*/, this.trackController.getCountOfTracks()];
                    case 3:
                        tracks = _a.sent();
                        if (tracks === null) {
                            tracks = [0];
                        }
                        return [4 /*yield*/, this.orderController.getCountOfTracksDownloaded()];
                    case 4:
                        orders = _a.sent();
                        if (orders.length === 0) {
                            orders = [{ "totalTracksDownloaded": 0, "totalAmountSpent": 0, "totalServicesPurchased": 0 }];
                        }
                        data = { users: users, services: services, tracks: tracks, orders: orders };
                        res.json(data);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        res.status(error_1.status || 500).send(!error_1.status ? new errors_1.InternalServerError("Something wrong") : error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserRouter.prototype.get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, search, role, type, sortKey, users, _b, _c, _d, error_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getLoginUser(req, res)];
                    case 1:
                        user = _e.sent();
                        _a = req.query, search = _a.search, role = _a.role, type = _a.type, sortKey = _a.sortKey;
                        _c = (_b = this.userController).get;
                        _d = [user, role, search, type, sortKey];
                        return [4 /*yield*/, shared_2.Pagination.pagination(req, 'U')];
                    case 2: return [4 /*yield*/, _c.apply(_b, _d.concat([_e.sent()]))];
                    case 3:
                        users = _e.sent();
                        users === null ? res.status(404).send(new errors_1.NotFoundError("No record found", {
                            message: "No record found", i18n: 'notExist'
                        })) : res.json(users);
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _e.sent();
                        res.status(error_2.status || 500).send(!error_2.status ? new errors_1.InternalServerError("Something wrong") : error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserRouter.prototype.getBy = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenUser, _a, search, role, user, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getLoginUser(req, res)];
                    case 1:
                        tokenUser = _b.sent();
                        _a = req.query, search = _a.search, role = _a.role;
                        return [4 /*yield*/, this.userController.getBy(tokenUser, role, search)];
                    case 2:
                        user = _b.sent();
                        user === null ? res.status(404).send(new errors_1.NotFoundError("No record found", {
                            message: "No record found", i18n: 'notExist'
                        })) : res.json(user);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        res.status(error_3.status || 500).send(!error_3.status ? new errors_1.InternalServerError("Something wrong") : error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserRouter.prototype.routes = function () {
        var _this = this;
        this.router.route("/get")
            .get(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.authentication, middleware_1.authorization([enums_1.Role.SuperAdmin]), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/get-by")
            .get(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.authentication, middleware_1.authorization([enums_1.Role.SuperAdmin]), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBy(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/dashboard")
            .get(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.authentication, middleware_1.authorization([enums_1.Role.SuperAdmin, enums_1.Role.Admin]), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dashboard(req, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/create")
            .post(middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, middleware_1.authorization(), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userController.create({
                                payload: req.body
                            }, 'API')];
                    case 1:
                        user = _a.sent();
                        // await this.userController.notifyNewUser(user.email);
                        res.json({
                            user: user
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log({ error: error_4 });
                        res.status(error_4.status || 500).send(!error_4.status ? new errors_1.InternalServerError("Something wrong") : error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/create/google")
            .post(middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, middleware_1.authorization(), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.oAuthController.createOAuthUser(req.body.langPref, req.body.token)];
                    case 1:
                        user = _a.sent();
                        res.json({
                            user: user
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.log({ error: error_5 });
                        res.status(error_5.status || 500).send(!error_5.status ? new errors_1.InternalServerError("Something wrong") : error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/me")
            .get(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.authentication, middleware_1.authorization([enums_1.Role.SuperAdmin, enums_1.Role.Admin, enums_1.Role.User]), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, users, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getLoginUser(req, res)];
                    case 1:
                        userId = (_a.sent()).userId;
                        return [4 /*yield*/, this.userController.me(userId)];
                    case 2:
                        users = _a.sent();
                        if (users === null) {
                            res.status(404).send(new errors_1.NotFoundError("Not found", {
                                message: "Not found",
                                i18n: 'notExist'
                            }));
                        }
                        else {
                            res.json({
                                users: users
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        res.status(error_6.status || 500).send(!error_6.status ? new errors_1.InternalServerError("Something wrong") : error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/profile")
            .patch(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, middleware_1.authorization([enums_1.Role.SuperAdmin, enums_1.Role.Admin, enums_1.Role.User]), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var token, user, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getLoginUser(req, res)];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, this.userController.edit(token.role, token.userId, {
                                query: { id: token.userId },
                                payload: req.body
                            })];
                    case 2:
                        user = _a.sent();
                        // await this.userController.notifyNewUser(user.email);
                        res.json({
                            user: user
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        res.status(error_7.status || 500).send(!error_7.status ? new errors_1.InternalServerError("Something wrong") : error_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/edit")
            .patch(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.authentication, middleware_1.authorization([enums_1.Role.SuperAdmin, enums_1.Role.Admin, enums_1.Role.User]), async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var search, token, user, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        search = req.query.search;
                        return [4 /*yield*/, this.getLoginUser(req, res)];
                    case 1:
                        token = _a.sent();
                        if (token !== null && (token.role === enums_1.Role.SuperAdmin || token.role === enums_1.Role.Admin || token.role === enums_1.Role.User)) {
                            search = token.userId;
                        }
                        return [4 /*yield*/, this.userController.edit(token.role, token.userId, {
                                query: { id: search },
                                payload: req.body
                            })];
                    case 2:
                        user = _a.sent();
                        // await this.userController.notifyNewUser(user.email);
                        res.json({
                            user: user
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.log({ error: error_8 });
                        res.status(error_8.status || 500).send(!error_8.status ? new errors_1.InternalServerError("Something wrong") : error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/login")
            .post(middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.staticAuthentication, async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, password, search, user, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, email = _a.email, password = _a.password;
                        search = email;
                        return [4 /*yield*/, this.userController.login({ search: search, password: password })];
                    case 1:
                        user = _b.sent();
                        res.json({
                            user: user
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _b.sent();
                        res.status(error_9.status || 500).send(!error_9.status ? new errors_1.InternalServerError("Something wrong") : error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/password/reset")
            .post(middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.staticAuthentication, async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var email, user, resetToken, message, language, heading, payload, subject, filename, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        email = req.body.email;
                        return [4 /*yield*/, user_model_1.User.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            if (user === null) {
                                return [2 /*return*/, res.status(401).send(new errors_1.NotFoundError("User not found", {
                                        message: 'User not found'
                                    }))];
                            }
                        }
                        return [4 /*yield*/, user.createPasswordResetToken()];
                    case 2:
                        resetToken = _a.sent();
                        message = "Need to reset your password? No problem! just use reset password token into your reset password screen with new password";
                        language = 'en';
                        heading = constants_1.TEMPLATES[language]['resetPassword']['subject'];
                        payload = { heading: heading, title: heading, message: message };
                        subject = heading;
                        filename = "reset.html";
                        return [4 /*yield*/, this.emailController.send(subject, payload, user.email, '', filename, resetToken)];
                    case 3:
                        _a.sent();
                        // await this.emailController.sendUserResetPasswordEmail({ user, resetToken });
                        res.json({ result: "Sent" });
                        return [3 /*break*/, 5];
                    case 4:
                        error_10 = _a.sent();
                        res.status(error_10.status || 500).send(!error_10.status ? new errors_1.InternalServerError("Something wrong") : error_10);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); }));
        this.router.route("/password/set")
            .post(middleware_1.sanitizeQuery, middleware_1.trimQueryWhiteSpace, middleware_1.sanitizeBody, middleware_1.trimBodyWhiteSpace, middleware_1.staticAuthentication, async_wrap_1.asyncWrap(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var resetToken, password, user, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        resetToken = req.query.resetToken;
                        password = req.body.password;
                        return [4 /*yield*/, this.userController.verifyUserResetToken(!resetToken ? '' : resetToken)];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            return [2 /*return*/, res.status(401).send(new errors_1.UnauthorizedError("Invalid Token", {
                                    message: 'Invalid Token'
                                }))];
                        }
                        return [4 /*yield*/, user.setPassword(password)];
                    case 2:
                        _a.sent();
                        res.json({ result: "Reset succesfully" });
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _a.sent();
                        res.status(error_11.status || 500).send(!error_11.status ? new errors_1.InternalServerError("Something wrong") : error_11);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }));
    };
    return UserRouter;
}());
exports.UserRouter = UserRouter;
exports.default = new UserRouter(user_controller_1.default, email_controller_1.default, oauth_controller_1.default, service_controller_1.default, track_controller_1.default, order_controller_1.default);
