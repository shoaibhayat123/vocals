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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQ = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var faqCategory_1 = require("./enums/faqCategory");
var FAQSchema = new mongoose_1.Schema({
    question: { type: String },
    answer: { type: String },
    category: { type: String, enum: faqCategory_1.CategoryValues },
    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
;
FAQSchema.statics.getSearchableFields = function () {
    return [
        "_id",
        "question",
        "answer",
        "category"
    ];
};
FAQSchema.statics.getClientFields = function () {
    return [
        "_id",
        "question",
        "answer",
        "category",
        "deleted",
        "createdAt"
    ];
};
FAQSchema.statics.getClientFieldsFilter = function () {
    return exports.FAQ.getClientFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
FAQSchema.statics.getSearchableFieldsFilter = function () {
    return exports.FAQ.getSearchableFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
exports.FAQ = mongoose_1.default.model('FAQ', FAQSchema);
