"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrap = void 0;
function asyncWrap(routeControllerFn) {
    return function (req, res, next) {
        Promise.resolve(routeControllerFn(req, res, next)).catch(next);
    };
}
exports.asyncWrap = asyncWrap;
;
