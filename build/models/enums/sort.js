"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortValues = exports.Sort = void 0;
var Sort;
(function (Sort) {
    Sort["ASC"] = "asc";
    Sort["DESC"] = "desc";
    Sort["ALPHA"] = "alpha";
})(Sort = exports.Sort || (exports.Sort = {}));
;
exports.SortValues = Object.keys(Sort).map(function (k) { return Sort[k]; });
