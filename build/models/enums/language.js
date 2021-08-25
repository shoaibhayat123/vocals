"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageValues = exports.Language = void 0;
var Language;
(function (Language) {
    Language["English"] = "en";
    Language["French"] = "fr";
})(Language = exports.Language || (exports.Language = {}));
;
exports.LanguageValues = Object.keys(Language).map(function (k) { return Language[k]; });
