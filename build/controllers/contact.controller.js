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
exports.ContactController = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var contact_model_1 = require("../models/contact.model");
var errors_1 = require("../errors");
var enums_1 = require("../models/enums");
// models
var user_model_1 = require("../models/user.model");
// controllers
var email_controller_1 = __importDefault(require("../controllers/email.controller"));
var constants_1 = require("../models/constants");
var ContactController = /** @class */ (function () {
    function ContactController(emailController) {
        this.emailController = emailController;
    }
    ContactController.prototype.returnGetResponse = function (query, sortKey, pageOptions) {
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
                                message: "Enter valid sorting options, Should be in " + enums_1.SortValues,
                                i18n: 'notExist'
                            });
                        }
                        if (sortKey === enums_1.Sort.ALPHA) {
                            sort = { name: 1 };
                        }
                        else if (sortKey === enums_1.Sort.DESC) {
                            sort = { createdAt: 1 };
                        }
                        _a.label = 2;
                    case 2:
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, contact_model_1.Contact.aggregate([{
                                    $facet: {
                                        paginatedResult: [
                                            { $match: query },
                                            { $sort: sort },
                                            { $skip: (pageOptions.limit * pageOptions.page) - pageOptions.limit },
                                            { $limit: pageOptions.limit }
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
    ContactController.prototype.returnGetByResponse = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, contact_model_1.Contact.aggregate([{
                                    $facet: {
                                        contact: [
                                            { $match: query }
                                        ]
                                    }
                                },
                                {
                                    $project: {
                                        "contact": { $ifNull: [{ $arrayElemAt: ["$contact", 0] }, null] }
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
    ContactController.prototype.get = function (search, type, sortKey, pageOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, filter, searchRegExp_1, searchableFields;
            return __generator(this, function (_a) {
                query = {};
                filter = contact_model_1.Contact.getSearchableFieldsFilter();
                if (search !== undefined && typeof search === 'string') {
                    searchRegExp_1 = new RegExp(search.split(' ').join('|'), 'ig');
                    searchableFields = Object.keys(filter).filter(function (f) { return f !== "_id"; });
                    query['$or'] = searchableFields.map(function (field) {
                        var _a, _b, _c;
                        return !type ? (_a = {}, _a[field] = search, _a) : type === enums_1.SearchType.Multi ? (_b = {}, _b[field] = searchRegExp_1, _b) : (_c = {}, _c[field] = search, _c);
                    });
                }
                return [2 /*return*/, this.returnGetResponse(query, sortKey, pageOptions)];
            });
        });
    };
    ContactController.prototype.getBy = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { _id: mongoose_1.default.Types.ObjectId(search) };
                        return [4 /*yield*/, this.returnGetByResponse(query)];
                    case 1: 
                    // let query = {};
                    // const filter = Contact.getSearchableFieldsFilter();
                    // if (search !== undefined && typeof search === 'string') {
                    //     const searchableFields = Object.keys(filter).filter(f => f !== "id");
                    //     query['$or'] = searchableFields.map(field => {
                    //         return { [field]: search };
                    //     })
                    // }
                    // query = { $and: [{ 'deleted': false }, query] };
                    // return Contact.findOne(query, Contact.getClientFieldsFilter());
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactController.prototype.create = function (_a) {
        var payload = _a.payload;
        return __awaiter(this, void 0, void 0, function () {
            var isValidPhone_1, isValidPhone_2, isValidEmail, contact, admins, adminEmails, language, heading, subject, filename;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isValidPhone_1 = true;
                        isValidPhone_2 = true;
                        if (!payload.email || !payload.comment) {
                            throw new errors_1.BadRequestError('Fields required (email, comment)', {
                                message: 'Fields required (email, comment)',
                            });
                        }
                        payload.email = payload.email.toLocaleLowerCase();
                        return [4 /*yield*/, user_model_1.User.checkEmailValidation(payload.email)];
                    case 1:
                        isValidEmail = _b.sent();
                        if (!payload.phone_1) return [3 /*break*/, 3];
                        return [4 /*yield*/, user_model_1.User.checkPhoneValidation(payload.phone_1)];
                    case 2:
                        isValidPhone_1 = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!payload.phone_1) return [3 /*break*/, 5];
                        return [4 /*yield*/, user_model_1.User.checkPhoneValidation(payload.phone_1)];
                    case 4:
                        isValidPhone_2 = _b.sent();
                        _b.label = 5;
                    case 5:
                        if (isValidEmail === false || isValidPhone_1 === false || isValidPhone_2 === false) {
                            throw new errors_1.BadRequestError("Email or phone format is not valid", {
                                message: 'Email or phone format is not valid',
                                i18n: 'formatIsNotValid',
                                payload: payload,
                            });
                        }
                        contact = new contact_model_1.Contact(__assign({}, payload));
                        return [4 /*yield*/, contact.save()];
                    case 6:
                        contact = _b.sent();
                        return [4 /*yield*/, user_model_1.User.find({ $or: [{ role: enums_1.Role.SuperAdmin }, { role: enums_1.Role.Admin }] })];
                    case 7:
                        admins = _b.sent();
                        adminEmails = admins ? admins.length > 0 ? admins.map(function (a) { return a.email; }) : [] : [];
                        language = 'en';
                        heading = constants_1.TEMPLATES[language]['contactInfo']['subject'];
                        subject = heading;
                        payload.title = heading;
                        payload.heading = heading;
                        payload.message = '';
                        filename = "contact.html";
                        return [4 /*yield*/, this.emailController.send(subject, payload, payload.email, adminEmails, filename, '')];
                    case 8:
                        _b.sent();
                        return [2 /*return*/, contact];
                }
            });
        });
    };
    ContactController.prototype.delete = function (_a) {
        var query = _a.query;
        return __awaiter(this, void 0, void 0, function () {
            var contact, _query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!query.id) {
                            throw new errors_1.BadRequestError('Id required', {
                                message: 'Id required',
                            });
                        }
                        return [4 /*yield*/, this._findContact(query.id)];
                    case 1:
                        contact = _b.sent();
                        if (contact === null) {
                            throw new errors_1.NotFoundError("Contact not found", {
                                message: 'Contact not found',
                                i18n: 'notFound'
                            });
                        }
                        _query = { _id: query.id };
                        return [4 /*yield*/, contact_model_1.Contact.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true })];
                    case 2:
                        contact = (_b.sent());
                        if (contact === null) {
                            throw new errors_1.BadRequestError('Contact not deleted correctly, Try to delete again', {
                                message: 'Contact not deleted correctly, Try to delete again',
                            });
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ContactController.prototype._findContact = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $or: [{ '_id': mongoose_1.default.Types.ObjectId(search) }, { 'email': search }] };
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, contact_model_1.Contact.findOne(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactController.prototype.findContact = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $or: [{ 'email': search }] };
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, contact_model_1.Contact.findOne(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ContactController;
}());
exports.ContactController = ContactController;
exports.default = new ContactController(email_controller_1.default);
