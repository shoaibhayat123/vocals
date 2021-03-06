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
var chai = __importStar(require("chai"));
var expect = chai.expect;
require("mocha");
var uuid_1 = require("uuid");
var chai_http_1 = __importDefault(require("chai-http"));
var constants_1 = require("../models/constants");
chai.use(chai_http_1.default);
var tokenFile = require('../tests/authTokenCheck.spec');
var uuid = uuid_1.v4();
var adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJzdXBlciBhZG1pbiIsInVzZXJJZCI6IjYxMjc2NjU5MzlmM2ZhMWE2NGUxMGI1NyJ9LCJpYXQiOjE2Mjk5NzIwNTcsImV4cCI6MTYzMDIzMTI1N30.Xglu5Ny7y8OmHFY0NrH96XJld7qnHkQiEHXogDtueJY';
describe('User Sign Up', function () {
    it('should sign up the user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai.request('http://localhost:3005/')
                        .post('v1/user/create')
                        .set('authorization', "Bearer " + constants_1.CONFIG.STATIC_TOKEN)
                        .send({
                        fullName: uuid,
                        userName: "" + (uuid + Math.random()),
                        email: uuid + "@gmail.com",
                        password: "abc@123",
                        phone_1: "1111111455",
                        phone_2: "1112122055",
                        gender: "male",
                        address: "plot bbc, street 5",
                        role: "user",
                        description: "lorem5",
                        imageUrl: "http://3.16.172.190:3005/static/1622736212474_7f5489e3.jpg",
                        isAcceptedTerm: true
                    })];
                case 1:
                    req = _a.sent();
                    expect(req).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not sign up', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai.request('http://localhost:3005/')
                        .post('v1/user/create')
                        .set('authorization', "Bearer " + constants_1.CONFIG.STATIC_TOKEN)
                        .send({
                        "fullName": uuid,
                        "userName": uuid,
                        "email": uuid + "@gmail.com",
                        "password": "abc@123",
                        "phone_1": "1111111455",
                        "phone_2": "1112122055",
                        "gender": "male",
                        "address": "plot bbc, street 5",
                        "role": "user",
                        "description": "lorem5",
                        "imageUrl": "http://3.16.172.190:3005/static/1622736212474_7f5489e3.jpg",
                        "isAcceptedTerm": true
                    })];
                case 1:
                    req = _a.sent();
                    expect(req).not.to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('User Signin', function () {
    it('should log in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai.request('http://localhost:3005/')
                        .post('v1/user/login')
                        .set('authorization', "Bearer " + constants_1.CONFIG.STATIC_TOKEN)
                        .send({
                        email: uuid + "@gmail.com",
                        password: 'abc@123',
                    })];
                case 1:
                    req = _a.sent();
                    expect(req).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not log in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai.request('http://localhost:3005/')
                        .post('v1/user/login')
                        .set('authorization', "Bearer " + constants_1.CONFIG.STATIC_TOKEN)
                        .send({
                        email: uuid + "@gmail.com",
                        password: 'abc@1234',
                    })];
                case 1:
                    req = _a.sent();
                    expect(req).not.to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('User Edit', function () {
    it('should edit username', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .patch('v1/user/profile?search=6124e6396874c027101ecea8')
                            .set('authorization', "Bearer " + token)
                            .send({
                            userName: "" + uuid,
                        })];
                case 2:
                    req = _a.sent();
                    expect(req).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not edit username', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .patch('v1/user/profile?search=6124e6396874c027101ecea8')
                            .set('authorization', "Bearer " + token)
                            .send({
                            userName: "" + uuid
                        })];
                case 2:
                    req = _a.sent();
                    expect(req).not.to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('User Profile', function () {
    it('should get user profile', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .get('v1/user/me')
                            .set('authorization', "Bearer " + token)];
                case 2:
                    req = _a.sent();
                    expect(req).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not get user profile', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .get('v1/user/me')
                            .set('authorization', "Bearer " + (token + 1))];
                case 2:
                    req = _a.sent();
                    expect(req).not.to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('List Of Users (Admin Only)', function () {
    it('should get list of users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai.request('http://localhost:3005/')
                        .get('v1/user/get')
                        .set('authorization', "Bearer " + adminToken)];
                case 1:
                    req = _a.sent();
                    expect(req).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not get list of users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .get('v1/user/get')
                            .set('authorization', "Bearer " + token)];
                case 2:
                    req = _a.sent();
                    expect(req).not.to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Get by userId (Admin Only)', function () {
    it('should get user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai.request('http://localhost:3005/')
                        .get('v1/user/get-by?search=61265cde2c87152be04a77ae')
                        .set('authorization', "Bearer " + adminToken)];
                case 1:
                    req = _a.sent();
                    expect(req).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not get user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .get('v1/user/get-by?search=61265cde2c87152be04a77ae')
                            .set('authorization', "Bearer " + token)];
                case 2:
                    req = _a.sent();
                    expect(req).not.to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('User Sign Out', function () {
    it('should sign out a user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .get('v1/session/logout')
                            .set('authorization', "Bearer " + token)];
                case 2:
                    req = _a.sent();
                    expect(req).to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not sign out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tokenFile.tokenExtractor()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, chai.request('http://localhost:3005/')
                            .get('v1/session/logout')
                            .set('authorization', "Bearer " + token)];
                case 2:
                    req = _a.sent();
                    expect(req).not.to.have.status(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
