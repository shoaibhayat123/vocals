"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimQueryWhiteSpace = exports.trimBodyWhiteSpace = void 0;
/**
* Calls .trim() on all root fields which are strings of the request payload
*/
function trimBodyWhiteSpace(req, _, next) {
    var payload = req.body;
    for (var _i = 0, _a = Object.keys(payload); _i < _a.length; _i++) {
        var key = _a[_i];
        var keyType = typeof payload[key];
        if (keyType === 'string') {
            payload[key] = payload[key].trim();
        }
        else {
        }
    }
    next();
}
exports.trimBodyWhiteSpace = trimBodyWhiteSpace;
function trimQueryWhiteSpace(req, _, next) {
    var query = req.query;
    for (var _i = 0, _a = Object.keys(query); _i < _a.length; _i++) {
        var key = _a[_i];
        var keyType = typeof query[key];
        if (keyType === 'string') {
            query[key] = query[key].trim();
        }
        else {
        }
    }
    next();
}
exports.trimQueryWhiteSpace = trimQueryWhiteSpace;
