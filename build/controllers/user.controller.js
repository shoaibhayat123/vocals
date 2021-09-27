"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.UserController = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var user_model_1 = require("../models/user.model");
var constants_1 = require("../models/constants");
var errors_1 = require("../errors");
var shared_1 = require("../shared");
var enums_1 = require("../models/enums");
// controllers
var email_controller_1 = __importDefault(require("../controllers/email.controller"));
var UserController = /** @class */ (function () {
    function UserController(emailController) {
        this.emailController = emailController;
    }
    UserController.prototype.returnGetResponse = function (query, role, sortKey, pageOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var sort, index, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sort = { createdAt: -1 };
                        if (!sortKey) return [3 /*break*/, 2];
                        return [4 /*yield*/, enums_1.SortValues.indexOf(sortKey)];
                    case 1:
                        index = _a.sent();
                        if (index === -1) {
                            throw new errors_1.BadRequestError("Enter valid sorting options, Should be in " + enums_1.SortValues, {
                                message: "Enter valid sorting options, Should be in " + enums_1.SortValues
                            });
                        }
                        if (sortKey === enums_1.Sort.ALPHA) {
                            sort = { fullName: 1 };
                        }
                        else if (sortKey === enums_1.Sort.DESC) {
                            sort = { createdAt: 1 };
                        }
                        _a.label = 2;
                    case 2:
                        if (role && role !== '') {
                            query = { $and: [{ 'role': role }, query] };
                        }
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, user_model_1.User.aggregate([{
                                    $facet: {
                                        paginatedResult: [
                                            { $match: query },
                                            // {
                                            //     $lookup: {
                                            //         from: 'users',
                                            //         as: 'manager',
                                            //         let: { user_id: '$_id' },
                                            //         pipeline: [
                                            //             { $addFields: { "user_id": { "$toObjectId": "$user_id" } } },
                                            //             {
                                            //                 $match: {
                                            //                     $expr: { $and: [{ $eq: ["$user_id", "$$user_id"] }, { $ne: ["$deleted", true] }] }
                                            //                 }
                                            //             }]
                                            //     }
                                            // },
                                            { $sort: sort },
                                            { $skip: (pageOptions.limit * pageOptions.page) - pageOptions.limit },
                                            { $limit: pageOptions.limit },
                                            { $project: { "passwordResetToken": 0, "passwordUpdated": 0, "password": 0 } }
                                        ],
                                        totalCount: [
                                            { $match: query },
                                            { $count: 'totalCount' }
                                        ]
                                    }
                                },
                                {
                                    $project: {
                                        "paginatedResult": "$paginatedResult",
                                        "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] },
                                    }
                                }])];
                    case 3:
                        data = _a.sent();
                        data = data.length > 0 ? data[0] : null;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    UserController.prototype.returnGetByResponse = function (query, role) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (role && role !== '') {
                            query = { $and: [{ 'role': role }, query] };
                        }
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, user_model_1.User.aggregate([{
                                    $facet: {
                                        user: [
                                            { $match: query },
                                            // {
                                            //     $lookup: {
                                            //         from: 'users',
                                            //         as: 'manager',
                                            //         let: { user_id: '$_id' },
                                            //         pipeline: [
                                            //             { $addFields: { "user_id": { "$toObjectId": "$user_id" } } },
                                            //             {
                                            //                 $match: {
                                            //                     $expr: { $and: [{ $eq: ["$user_id", "$$user_id"] }, { $ne: ["$deleted", true] }] }
                                            //                 }
                                            //             }]
                                            //     }
                                            // },
                                            { $project: { "passwordResetToken": 0, "passwordUpdated": 0, "password": 0 } }
                                        ]
                                    }
                                },
                                {
                                    $project: {
                                        "user": { $ifNull: [{ $arrayElemAt: ["$user", 0] }, null] }
                                    }
                                }])];
                    case 1:
                        data = _a.sent();
                        data = data.length > 0 ? data[0] : null;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    UserController.prototype.get = function (user, role, search, type, sortKey, pageOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, filter, searchRegExp_1, searchableFields;
            return __generator(this, function (_a) {
                query = {};
                if (user && user.role !== enums_1.Role.Admin && role !== enums_1.Role.SuperAdmin) {
                    query = { $and: [{ 'role': { $ne: enums_1.Role.SuperAdmin } }, { 'role': { $ne: enums_1.Role.Admin } }, query] };
                }
                filter = user_model_1.User.getSearchableFieldsFilter();
                if (search !== undefined && search !== '' && typeof search === 'string') {
                    searchRegExp_1 = new RegExp(search.split(' ').join('|'), 'ig');
                    searchableFields = Object.keys(filter).filter(function (f) { return f !== "_id"; });
                    query['$or'] = searchableFields.map(function (field) {
                        var _a, _b, _c;
                        return !type ? (_a = {}, _a[field] = search, _a) : type === enums_1.SearchType.Multi ? (_b = {}, _b[field] = searchRegExp_1, _b) : (_c = {}, _c[field] = search, _c);
                    });
                }
                return [2 /*return*/, this.returnGetResponse(query, role, sortKey, pageOptions)];
            });
        });
    };
    UserController.prototype.getBy = function (user, role, search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {};
                        if (search && search !== '') {
                            query = { _id: mongoose_1.default.Types.ObjectId(search) };
                        }
                        return [4 /*yield*/, this.returnGetByResponse(query, role)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.me = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.findById({ '_id': id }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl tracks "
                            + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt").populate('wishList')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.create = function (_a, from) {
        var payload = _a.payload;
        return __awaiter(this, void 0, void 0, function () {
            var isUnique, isUnique, user, access_token, setPassword;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // if (!payload.role || RoleValues.indexOf(payload.role) === -1 || (!payload.email && !payload.userName)
                        //     || !payload.fullName) {
                        //     throw new BadRequestError(`Required fileds (email or user name, role, full name). Validate fields (role -> ${RoleValues}`, {
                        //         message: `Required fileds (email or user name, role, full name). Validate fields (role -> must be in ${RoleValues}`,
                        //     });
                        // }
                        if ((!payload.role || enums_1.RoleValues.indexOf(payload.role) === -1 // || payload.role === Role.SuperAdmin
                            || payload.role === enums_1.Role.Admin) || (!payload.email && !payload.userName) || !payload.fullName) {
                            throw new errors_1.BadRequestError("Required fileds (email or user name, role, full name). Validate fields (role -> " + enums_1.Role.SuperAdmin + ", " + enums_1.Role.Admin + ", " + enums_1.Role.User + ")", {
                                message: "Required fileds (email or user name, role, full name). Validate fields (role -> must be in " + enums_1.Role.SuperAdmin + ", " + enums_1.Role.Admin + ", " + enums_1.Role.User + ")",
                            });
                        }
                        if (from === 'API' && (!payload.password || !payload.isAcceptedTerm)) {
                            throw new errors_1.BadRequestError("Required fileds (password, term)", {
                                message: "Required fileds (password, term)",
                            });
                        }
                        if (payload.gender && enums_1.GenderValues.indexOf(payload.gender) === -1) {
                            throw new errors_1.BadRequestError("Validate fields (gender " + enums_1.GenderValues + ")", {
                                message: "Validate fields (gender " + enums_1.GenderValues + ")",
                            });
                        }
                        if (!payload.email) return [3 /*break*/, 2];
                        payload.email = payload.email.toLocaleLowerCase();
                        return [4 /*yield*/, this.emailIsUnique(payload.email)];
                    case 1:
                        isUnique = _b.sent();
                        if (isUnique === false) {
                            throw new errors_1.BadRequestError("Cannot create user, email already in use", {
                                message: 'Cannot create user, email already in use',
                                payload: payload,
                            });
                        }
                        _b.label = 2;
                    case 2:
                        if (!payload.userName) return [3 /*break*/, 4];
                        payload.userName = payload.userName.toLocaleLowerCase();
                        return [4 /*yield*/, this.userNameIsUnique(payload.userName)];
                    case 3:
                        isUnique = _b.sent();
                        if (isUnique === false) {
                            throw new errors_1.BadRequestError("Cannot create user, user name already in use", {
                                message: 'Cannot create user, user name already in use',
                                payload: payload,
                            });
                        }
                        _b.label = 4;
                    case 4:
                        payload.fullName = payload.fullName.toLowerCase();
                        user = new user_model_1.User(__assign({}, payload));
                        return [4 /*yield*/, user.save()];
                    case 5:
                        _b.sent();
                        access_token = '';
                        if (!user) return [3 /*break*/, 9];
                        if (!payload.password) return [3 /*break*/, 7];
                        return [4 /*yield*/, user.setPassword(payload.password)];
                    case 6:
                        setPassword = _b.sent();
                        _b.label = 7;
                    case 7: return [4 /*yield*/, shared_1.createJwt({
                            data: {
                                role: user.role,
                                userId: user._id,
                            }
                        })];
                    case 8:
                        access_token = _b.sent();
                        _b.label = 9;
                    case 9: 
                    // const superAdmin = await User.findOne({ role: Role.SuperAdmin });
                    // const superAdminEmail = !superAdmin ? '' : superAdmin.email;
                    // const language = 'en';
                    // const filename = "signup.html";
                    // const heading = TEMPLATES[language]['signUp']['subject'];
                    // const subject = heading;
                    // payload.title = heading;
                    // payload.heading = heading;
                    // payload.message = 'New user sign-up or created';
                    // payload.email = user.email;
                    // payload.fullName = user.fullName;
                    // payload.phone_1 = user.phone_1;
                    // payload.role = user.role;
                    // await this.emailController.send(subject, payload, superAdminEmail, '', filename, '');
                    return [2 /*return*/, {
                            access_token: access_token,
                            fullName: user.fullName,
                            role: user.role,
                            userId: user._id,
                            langPref: user.langPref,
                        }];
                }
            });
        });
    };
    UserController.prototype.edit = function (role, userId, _a) {
        var query = _a.query, payload = _a.payload;
        return __awaiter(this, void 0, void 0, function () {
            var user, user_1, isUnique, updateDoc, _query, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (payload.gender && enums_1.GenderValues.indexOf(payload.gender) === -1) {
                            throw new errors_1.BadRequestError("Validate fields (gender " + enums_1.GenderValues + ")", {
                                message: "Validate fields (gender " + enums_1.GenderValues + ")",
                            });
                        }
                        return [4 /*yield*/, user_model_1.User.findById({ '_id': query.id }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
                                + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt")];
                    case 1:
                        user = _b.sent();
                        if (user === null) {
                            throw new errors_1.UnauthorizedError("User not found against token", {
                                message: "User not found against token",
                            });
                        }
                        if (!payload.email) return [3 /*break*/, 3];
                        payload.email = payload.email.toLocaleLowerCase();
                        if (!(user.email !== payload.email)) return [3 /*break*/, 3];
                        return [4 /*yield*/, user_model_1.User.findOne({ 'email': payload.email }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
                                + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt")];
                    case 2:
                        user_1 = _b.sent();
                        if (user_1 !== null) {
                            throw new errors_1.UnauthorizedError("Email already is in use", {
                                message: "Email already is in use",
                            });
                        }
                        _b.label = 3;
                    case 3:
                        if (!payload.userName) return [3 /*break*/, 5];
                        payload.userName = payload.userName.toLocaleLowerCase();
                        return [4 /*yield*/, this.userNameIsUnique(payload.userName)];
                    case 4:
                        isUnique = _b.sent();
                        if (isUnique === false) {
                            throw new errors_1.BadRequestError("Cannot edit user, user name already in use", {
                                message: 'Cannot edit user, user name already in use',
                                payload: payload,
                            });
                        }
                        _b.label = 5;
                    case 5:
                        // if (payload.role && (RoleValues.indexOf(payload.role) === -1 || payload.role === Role.Client) {
                        //     throw new BadRequestError(`Role must be in ${RoleValues}, but client role not valid for auth operations`, {
                        //         message: `Role must be in ${RoleValues}, but client role not valid for auth operations`,
                        //     });
                        // }
                        if ((payload.deactivated || payload.deleted)
                            && role !== enums_1.Role.SuperAdmin && role !== enums_1.Role.Admin) {
                            payload.deactivated = user.deactivated;
                            payload.deleted = user.deleted;
                        }
                        payload.role = user.role;
                        payload.email = !payload.email ? user.email : payload.email.toLowerCase();
                        payload.fullName = !payload.fullName ? user.fullName : payload.fullName.toLowerCase();
                        updateDoc = __assign({}, payload);
                        _query = { _id: user._id };
                        return [4 /*yield*/, user_model_1.User.findOneAndUpdate(_query, updateDoc, {
                                upsert: true, new: true, useFindAndModify: false, select: "langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl tracks wishList "
                                    + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt"
                            })];
                    case 6:
                        result = _b.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    UserController.prototype.login = function (_a) {
        var search = _a.search, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var user, access_token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!search) {
                            throw new errors_1.BadRequestError('Email or User Name required', {
                                message: 'Email or User Name required',
                            });
                        }
                        if (!password) {
                            throw new errors_1.BadRequestError('Password required', {
                                message: 'Password required',
                            });
                        }
                        return [4 /*yield*/, this.findUser(search.toLocaleLowerCase())];
                    case 1:
                        user = _b.sent();
                        if (user === null) {
                            throw new errors_1.UnauthorizedError("Invalid user", {
                                message: 'Invalid user',
                            });
                        }
                        if (user.deactivated === true) {
                            throw new errors_1.ForbiddenError("Account Deactivated", {
                                message: 'Account Deactivated',
                            });
                        }
                        return [4 /*yield*/, user.checkPassword(password)];
                    case 2:
                        if (!(_b.sent())) {
                            throw new errors_1.UnauthorizedError("Invalid password", {
                                message: 'Invalid password',
                            });
                        }
                        return [4 /*yield*/, shared_1.createJwt({
                                data: {
                                    role: user.role,
                                    userId: user._id
                                }
                            })];
                    case 3:
                        access_token = _b.sent();
                        return [2 /*return*/, {
                                access_token: access_token,
                                fullName: user.fullName,
                                role: user.role,
                                userId: user._id,
                                langPref: user.langPref
                            }];
                }
            });
        });
    };
    UserController.prototype.send = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, code, language, message, heading, payload, subject, filename, _query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.findOne({ "email": email }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
                            + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt")];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            throw new errors_1.NotFoundError("User not found", {
                                message: "User not found",
                            });
                        }
                        code = shared_1.randomString(6);
                        language = 'en';
                        message = 'Your confirmation code is here';
                        heading = constants_1.TEMPLATES[language]['sendCode']['subject'];
                        payload = { heading: heading, title: heading, message: message, code: code };
                        subject = heading;
                        filename = "code.html";
                        return [4 /*yield*/, this.emailController.send(subject, payload, user.email, '', filename, '')];
                    case 2:
                        _a.sent();
                        user.code = code;
                        _query = { _id: user.id };
                        return [4 /*yield*/, user_model_1.User.findOneAndUpdate(_query, user, { upsert: true, new: true, useFindAndModify: false })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    UserController.prototype.verifyUserCode = function (email, code) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.findOne({ $and: [{ "email": email }, { "code": code }] })];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            throw new errors_1.BadRequestError("Invalid Code", {
                                message: "Invalid Code",
                            });
                        }
                        return [4 /*yield*/, user.createPasswordResetToken()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.verifyUserResetToken = function (resetToken) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.findOne({ "passwordResetToken.token": resetToken })];
                    case 1:
                        user = _a.sent();
                        if (user === null) {
                            throw new errors_1.NotFoundError("User not found", {
                                message: "User not found",
                            });
                        }
                        if (user.verifyPasswordResetToken(resetToken) === true) {
                            return [2 /*return*/, user];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.setPassword = function (_a) {
        var search = _a.search, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var user, setPassword, access_token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._findUser(search)];
                    case 1:
                        user = _b.sent();
                        if (user === null) {
                            throw new errors_1.NotFoundError("User not found against search (" + search + ")", {
                                message: "User not found against search (" + search + ")",
                            });
                        }
                        if (!password) {
                            throw new errors_1.BadRequestError('Password required', {
                                message: 'Password required',
                            });
                        }
                        if (user.password) {
                            throw new errors_1.UnauthorizedError('User first password already set', {
                                message: 'User first password already set',
                            });
                        }
                        return [4 /*yield*/, user.setPassword(password)];
                    case 2:
                        setPassword = _b.sent();
                        return [4 /*yield*/, shared_1.createJwt({
                                data: {
                                    role: user.role,
                                    userId: user._id,
                                }
                            })];
                    case 3:
                        access_token = _b.sent();
                        return [2 /*return*/, {
                                access_token: access_token,
                                fullName: user.fullName,
                                role: user.role,
                                userId: user._id,
                                langPref: user.langPref
                            }];
                }
            });
        });
    };
    UserController.prototype.forgetPassword = function (_a) {
        var search = _a.search, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var user, setPassword;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._findUser(search)];
                    case 1:
                        user = _b.sent();
                        if (user === null) {
                            throw new errors_1.NotFoundError("User not found against search (" + search + ")", {
                                message: "User not found against search (" + search + ")",
                            });
                        }
                        if (!password) {
                            throw new errors_1.BadRequestError('Password required', {
                                message: 'Password required',
                            });
                        }
                        return [4 /*yield*/, user.setPassword(password)];
                    case 2:
                        setPassword = _b.sent();
                        return [2 /*return*/, {
                                role: user.role,
                                langPref: user.langPref
                            }];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (_a) {
        var search = _a.search, password = _a.password, newPassword = _a.newPassword;
        return __awaiter(this, void 0, void 0, function () {
            var user, setPassword, access_token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._findUser(search)];
                    case 1:
                        user = _b.sent();
                        if (user === null) {
                            throw new errors_1.UnauthorizedError("User not found", {
                                message: "User not found",
                            });
                        }
                        if (!password) {
                            throw new errors_1.BadRequestError('Password required', {
                                message: 'Password required',
                            });
                        }
                        if (!newPassword) {
                            throw new errors_1.BadRequestError('New password required', {
                                message: 'New password required',
                            });
                        }
                        return [4 /*yield*/, user.checkPassword(password)];
                    case 2:
                        if (!(_b.sent())) {
                            throw new errors_1.BadRequestError("Wrong old password", {
                                message: 'Wrong old password',
                            });
                        }
                        return [4 /*yield*/, user.setPassword(newPassword)];
                    case 3:
                        setPassword = _b.sent();
                        return [4 /*yield*/, shared_1.createJwt({
                                data: {
                                    role: user.role,
                                    userId: user._id,
                                }
                            })];
                    case 4:
                        access_token = _b.sent();
                        return [2 /*return*/, {
                                access_token: access_token,
                                fullName: user.fullName,
                                role: user.role,
                                userId: user._id,
                                langPref: user.langPref
                            }];
                }
            });
        });
    };
    UserController.prototype.getCountOfUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.aggregate([{
                                $facet: {
                                    totalCount: [
                                        { $count: 'totalCount' }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] },
                                }
                            }])];
                    case 1:
                        data = _a.sent();
                        data = data.length > 0 ? data[0] : null;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    UserController.prototype.notifyNewUser = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.findOne({ email: email }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
                            + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt")];
                    case 1:
                        user = _a.sent();
                        if (user === null)
                            throw new errors_1.InternalServerError("Something went wrong while creating user", {
                                message: 'Something went wrong while creating user',
                            });
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype._findUser = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $or: [{ '_id': mongoose_1.default.Types.ObjectId(search) }, { 'email': search }, { 'userName': search }] };
                        return [4 /*yield*/, user_model_1.User.findOne(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.findUser = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $or: [{ 'email': search }, { 'userName': search }] };
                        return [4 /*yield*/, user_model_1.User.findOne(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.findUserWithRole = function (search, role) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $and: [{ '_id': mongoose_1.default.Types.ObjectId(search) }, { 'role': role }, { 'deleted': false }] };
                        return [4 /*yield*/, user_model_1.User.findOne(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.phoneIsUnique = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.findOne({ phone: phone })];
                    case 1: return [2 /*return*/, (_a.sent()) === null];
                }
            });
        });
    };
    UserController.prototype.emailIsUnique = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var isValidEmail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.checkEmailValidation(email)];
                    case 1:
                        isValidEmail = _a.sent();
                        if (isValidEmail === false) {
                            throw new errors_1.BadRequestError("Cannot create user, email format is not valid", {
                                message: 'Cannot create user, email format is not valid'
                            });
                        }
                        return [4 /*yield*/, user_model_1.User.findOne({ email: email })];
                    case 2: return [2 /*return*/, (_a.sent()) === null];
                }
            });
        });
    };
    UserController.prototype.userNameIsUnique = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            var isValidUserName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.User.checkUserNameValidation(userName)];
                    case 1:
                        isValidUserName = _a.sent();
                        if (isValidUserName === false) {
                            throw new errors_1.BadRequestError("Cannot create user, user name format or remove space is not valid", {
                                message: 'Cannot create user, user name format or remove space is not valid'
                            });
                        }
                        return [4 /*yield*/, user_model_1.User.findOne({ userName: userName })];
                    case 2: return [2 /*return*/, (_a.sent()) === null];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
exports.default = new UserController(email_controller_1.default);
