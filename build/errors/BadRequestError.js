"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message, payload) {
        var _this = _super.call(this, message) || this;
        _this.status = BadRequestError.StatusCode;
        _this.statusMessage = "Bad Request";
        _this.name = _this.constructor.name;
        _this.payload = payload;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    BadRequestError.StatusCode = 400;
    return BadRequestError;
}(Error));
exports.BadRequestError = BadRequestError;
;
