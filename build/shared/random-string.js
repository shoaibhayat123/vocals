"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = void 0;
var crypto_1 = __importDefault(require("crypto"));
function randomString(length) {
    var s = crypto_1.default.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    return s;
}
exports.randomString = randomString;
