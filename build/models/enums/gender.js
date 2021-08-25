"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenderValues = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
;
exports.GenderValues = Object.keys(Gender).map(function (k) { return Gender[k]; });
