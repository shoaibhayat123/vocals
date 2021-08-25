"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentNameValues = exports.EnvironmentName = void 0;
var EnvironmentName;
(function (EnvironmentName) {
    EnvironmentName["Production"] = "production";
    EnvironmentName["Stage"] = "stage";
    EnvironmentName["Test"] = "test";
    EnvironmentName["Local"] = "local";
})(EnvironmentName = exports.EnvironmentName || (exports.EnvironmentName = {}));
;
exports.EnvironmentNameValues = Object.keys(EnvironmentName).map(function (k) { return EnvironmentName[k]; });
