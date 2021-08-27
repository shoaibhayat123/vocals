"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValues = exports.FaqCategory = void 0;
var FaqCategory;
(function (FaqCategory) {
    FaqCategory["Subscription"] = "subscription";
    FaqCategory["Troubleshooting"] = "troubleshooting";
    FaqCategory["RoyaltyFreeMusic"] = "royaltyfreemusic";
    FaqCategory["SFXLicensing"] = "sfxlicensing";
    FaqCategory["Technical"] = "technical";
    FaqCategory["Security"] = "security";
})(FaqCategory = exports.FaqCategory || (exports.FaqCategory = {}));
;
exports.CategoryValues = Object.keys(FaqCategory).map(function (k) { return FaqCategory[k]; });
