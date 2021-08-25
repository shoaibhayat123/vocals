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
exports.Session = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var SessionSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    token: { type: String },
    ip: { type: String },
    isLogout: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
;
SessionSchema.statics.getSearchableFields = function () {
    return [
        "_id",
        "user_id",
        "token",
        "ip"
    ];
};
SessionSchema.statics.getClientFields = function () {
    return [
        "_id",
        "user_id",
        "token",
        "ip",
        "isLogout",
        "createdAt"
    ];
};
SessionSchema.statics.getClientFieldsFilter = function () {
    return exports.Session.getClientFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
SessionSchema.statics.getSearchableFieldsFilter = function () {
    return exports.Session.getSearchableFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
exports.Session = mongoose_1.default.model('Session', SessionSchema);
