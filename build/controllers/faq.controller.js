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
exports.FAQController = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var FAQ_model_1 = require("../models/FAQ.model");
var enums_1 = require("../models/enums");
var errors_1 = require("../errors");
var FAQController = /** @class */ (function () {
    function FAQController() {
    }
    FAQController.prototype.get = function (search, type) {
        return __awaiter(this, void 0, void 0, function () {
            var query, filter, searchRegExp_1, searchableFields;
            return __generator(this, function (_a) {
                query = {};
                filter = FAQ_model_1.FAQ.getSearchableFieldsFilter();
                if (search !== undefined && typeof search === 'string') {
                    searchRegExp_1 = new RegExp(search.split(' ').join('|'), 'ig');
                    searchableFields = Object.keys(filter).filter(function (f) { return f !== "_id"; });
                    query['$or'] = searchableFields.map(function (field) {
                        var _a, _b, _c;
                        return !type ? (_a = {}, _a[field] = search, _a) : type === enums_1.SearchType.Multi ? (_b = {}, _b[field] = searchRegExp_1, _b) : (_c = {}, _c[field] = search, _c);
                    });
                }
                return [2 /*return*/, this.returnGetResponse(query)];
            });
        });
    };
    FAQController.prototype.getBy = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { _id: mongoose_1.default.Types.ObjectId(search) };
                        return [4 /*yield*/, this.returnGetByResponse(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FAQController.prototype.create = function (_a) {
        var payload = _a.payload;
        return __awaiter(this, void 0, void 0, function () {
            var faq;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!payload.question || !payload.answer || !payload.category) {
                            throw new errors_1.BadRequestError("Validate fields question and answer", {
                                message: "Requiered Fields question and answer",
                            });
                        }
                        faq = new FAQ_model_1.FAQ(__assign({}, payload));
                        return [4 /*yield*/, faq.save()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, faq];
                }
            });
        });
    };
    FAQController.prototype.edit = function (_a) {
        var query = _a.query, payload = _a.payload;
        return __awaiter(this, void 0, void 0, function () {
            var faq, updateDoc, _query, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!query.id) {
                            throw new errors_1.BadRequestError('Id required', {
                                message: 'Id required',
                            });
                        }
                        return [4 /*yield*/, this._findFAQ(query.id)];
                    case 1:
                        faq = _b.sent();
                        if (faq === null) {
                            throw new errors_1.NotFoundError("FAQ not found", {
                                message: 'FAQ not found',
                                i18n: 'notFound'
                            });
                        }
                        updateDoc = __assign({}, payload);
                        _query = { _id: faq._id };
                        return [4 /*yield*/, FAQ_model_1.FAQ.findOneAndUpdate(_query, updateDoc, {
                                upsert: true, new: true, useFindAndModify: false
                            })];
                    case 2:
                        result = _b.sent();
                        if (result === null) {
                            throw new errors_1.BadRequestError('FAQ not edited correctly, Try to edit again', {
                                message: 'FAQ not edited correctly, Try to edit again',
                            });
                        }
                        else {
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FAQController.prototype.delete = function (_a) {
        var query = _a.query;
        return __awaiter(this, void 0, void 0, function () {
            var faq, _query;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!query.id) {
                            throw new errors_1.BadRequestError('Id required', {
                                message: 'Id required',
                            });
                        }
                        return [4 /*yield*/, this._findFAQ(query.id)];
                    case 1:
                        faq = _b.sent();
                        if (faq === null) {
                            throw new errors_1.NotFoundError("FAQ not found", {
                                message: 'FAQ not found',
                                i18n: 'notFound'
                            });
                        }
                        _query = { _id: query.id };
                        return [4 /*yield*/, FAQ_model_1.FAQ.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true, useFindAndModify: false })];
                    case 2:
                        faq = (_b.sent());
                        if (faq === null) {
                            throw new errors_1.BadRequestError('FAQ not deleted correctly, Try to delete again', {
                                message: 'FAQ not deleted correctly, Try to delete again',
                            });
                        }
                        else {
                            return [2 /*return*/, faq];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FAQController.prototype._findFAQ = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $or: [{ '_id': mongoose_1.default.Types.ObjectId(search) }] };
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, FAQ_model_1.FAQ.findOne(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FAQController.prototype.returnGetResponse = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, FAQ_model_1.FAQ.aggregate([{
                                    $facet: {
                                        paginatedResult: [
                                            { $match: query },
                                            { $sort: { category: 1 } },
                                        ],
                                        totalCount: [
                                            { $match: query },
                                            { $count: 'totalCount' }
                                        ]
                                    }
                                },
                                {
                                    $project: {
                                        "result": "$paginatedResult",
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
    FAQController.prototype.returnGetByResponse = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { $and: [{ 'deleted': false }, query] };
                        return [4 /*yield*/, FAQ_model_1.FAQ.aggregate([{
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
    return FAQController;
}());
exports.FAQController = FAQController;
exports.default = new FAQController();
