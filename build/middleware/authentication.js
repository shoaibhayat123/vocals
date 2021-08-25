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
exports.authenticationQueryParam = exports.authentication = void 0;
var express_http_context_1 = __importDefault(require("express-http-context"));
var shared_1 = require("../shared");
var errors_1 = require("../errors");
var session_model_1 = require("../models/session.model");
var user_model_1 = require("../models/user.model");
var constants_1 = require("../models/constants");
/**
*	Load JWT from Authorization header to res.locals.jwtData
*/
function authentication(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var requestMethod, requestUrl, auth, _b, token, session, decodedToken, user, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    requestMethod = req.method;
                    requestUrl = (_a = req.baseUrl) === null || _a === void 0 ? void 0 : _a.split('/')[2];
                    if (!req.headers['authorization']) {
                        return [2 /*return*/, res.status(401).send(new errors_1.UnauthorizedError("No credentials provided", {
                                message: 'No credentials provided'
                            }))];
                        // return next(new UnauthorizedError("No credentials provided"));
                    }
                    res.locals.clientId = req.headers['x-client-id'];
                    auth = req.headers['authorization'];
                    _b = auth.split(' '), token = _b[1];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    if (!((token === constants_1.CONFIG.STATIC_TOKEN && requestMethod === 'GET' && requestUrl && constants_1.CONFIG.mutliGETRouteModules.indexOf(requestUrl) !== -1)
                        || (token === constants_1.CONFIG.STATIC_TOKEN && requestMethod === 'POST' && requestUrl && constants_1.CONFIG.mutliPOSTRouteModules.indexOf(requestUrl) !== -1))) return [3 /*break*/, 2];
                    res.locals.jwtData = token;
                    express_http_context_1.default.set('jwtData', token);
                    next();
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, session_model_1.Session.findOne({ $and: [{ token: token, isLogout: true }] }).sort('-createdAt')];
                case 3:
                    session = _c.sent();
                    if (session !== null) {
                        return [2 /*return*/, res.status(401).send(new errors_1.UnauthorizedError("Credentials expired", {
                                message: 'Credentials expired'
                            }))];
                    }
                    return [4 /*yield*/, shared_1.verifyJwt(token)];
                case 4:
                    decodedToken = _c.sent();
                    return [4 /*yield*/, user_model_1.User.findById({ '_id': decodedToken.data.userId }).sort('-createdAt')];
                case 5:
                    user = _c.sent();
                    if (user === null) {
                        return [2 /*return*/, res.status(400).send(new errors_1.BadRequestError("Logined user not found!", {
                                message: "Logined user not found!"
                            }))];
                    }
                    res.locals.jwtData = decodedToken.data;
                    express_http_context_1.default.set('jwtData', decodedToken.data);
                    next();
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _c.sent();
                    // next(new UnauthorizedError("Invalid Token"));
                    return [2 /*return*/, res.status(401).send(new errors_1.UnauthorizedError("Invalid Token", {
                            message: 'Invalid Token'
                        }))];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.authentication = authentication;
/**
*	Load JWT from Query Params to res.locals.jwtData
*/
function authenticationQueryParam(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var providedJwt, decodedToken, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query['jwt']) {
                        return [2 /*return*/, res.status(401).send(new errors_1.UnauthorizedError("No credentials provided", {
                                message: 'No credentials provided'
                            }))];
                        // return next(new UnauthorizedError("No credentials provided"));
                    }
                    providedJwt = req.query['jwt'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, shared_1.verifyJwt(providedJwt)];
                case 2:
                    decodedToken = _a.sent();
                    res.locals.jwtData = decodedToken.data;
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    // next(new UnauthorizedError("Invalid Token"));
                    return [2 /*return*/, res.status(401).send(new errors_1.UnauthorizedError("Invalid Token", {
                            message: 'Invalid Token'
                        }))];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.authenticationQueryParam = authenticationQueryParam;
