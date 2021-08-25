"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALT_LENGTH = exports.JWT_EXPIRY_SECONDS = void 0;
exports.JWT_EXPIRY_SECONDS = 3600 * 24 * 3;
exports.SALT_LENGTH = 32;
__exportStar(require("./config"), exports);
__exportStar(require("./email-templates"), exports);
__exportStar(require("./date-formats"), exports);
