"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValues = exports.FaqCategory = void 0;
var FaqCategory;
(function (FaqCategory) {
    FaqCategory["Subscription"] = "Subscription";
    FaqCategory["Troubleshooting"] = "Troubleshooting";
    FaqCategory["RoyaltyFreeMusic"] = "Royalty-Free-Music";
    FaqCategory["SFXLicensing"] = "SFX-Licensing";
    FaqCategory["Technical"] = "Technical";
    FaqCategory["Security"] = "Security";
})(FaqCategory = exports.FaqCategory || (exports.FaqCategory = {}));
;
exports.CategoryValues = Object.keys(FaqCategory).map(function (k) { return FaqCategory[k]; });
