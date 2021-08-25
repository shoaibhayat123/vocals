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
exports.Contact = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var ContactSchema = new mongoose_1.Schema({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    phone_1: { type: String },
    phone_2: { type: String },
    subject: { type: String },
    comment: { type: String },
    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
;
ContactSchema.statics.getSearchableFields = function () {
    return [
        "_id",
        "email",
        "firstName",
        "lastName",
        "fullName"
    ];
};
ContactSchema.statics.getClientFields = function () {
    return [
        "_id",
        "email",
        "firstName",
        "lastName",
        "fullName",
        "phone_1",
        "phone_2",
        "subject",
        "comment",
        "createdAt"
    ];
};
ContactSchema.statics.getClientFieldsFilter = function () {
    return exports.Contact.getClientFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
ContactSchema.statics.getSearchableFieldsFilter = function () {
    return exports.Contact.getSearchableFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
exports.Contact = mongoose_1.default.model('Contact', ContactSchema);
