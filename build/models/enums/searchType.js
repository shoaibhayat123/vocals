"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchTypeValues = exports.SearchType = void 0;
var SearchType;
(function (SearchType) {
    SearchType["Single"] = "single";
    SearchType["Multi"] = "multi";
})(SearchType = exports.SearchType || (exports.SearchType = {}));
;
exports.SearchTypeValues = Object.keys(SearchType).map(function (k) { return SearchType[k]; });
