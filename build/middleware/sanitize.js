"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeParams = exports.sanitizeQuery = exports.sanitizeBody = void 0;
var mongo_sanitize_1 = __importDefault(require("mongo-sanitize"));
// Mitigate injection attacks by escaping special mongodb characters
function sanitizeBody(req, _, next) {
    // logger.silly('[sanitizeBody]: ', req.body);
    for (var _i = 0, _a = Object.keys(req.body); _i < _a.length; _i++) {
        var k = _a[_i];
        req.body[k] = mongo_sanitize_1.default(req.body[k]);
    }
    next();
}
exports.sanitizeBody = sanitizeBody;
function sanitizeQuery(req, _, next) {
    // logger.silly('[sanitizeQuery]: ', req.query);
    for (var _i = 0, _a = Object.keys(req.query); _i < _a.length; _i++) {
        var k = _a[_i];
        req.query[k] = mongo_sanitize_1.default(req.query[k]);
    }
    next();
}
exports.sanitizeQuery = sanitizeQuery;
function sanitizeParams(req, _, next) {
    // logger.silly('[sanitizeParams]: ', req.params);
    for (var _i = 0, _a = Object.keys(req.params); _i < _a.length; _i++) {
        var k = _a[_i];
        req.params[k] = mongo_sanitize_1.default(req.params[k]);
    }
    next();
}
exports.sanitizeParams = sanitizeParams;
