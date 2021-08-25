"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusValues = exports.Status = void 0;
var Status;
(function (Status) {
    Status["completed"] = "completed";
    Status["pending"] = "pending";
    Status["proceed"] = "proceed";
    Status["checkout"] = "checkout";
    Status["cancelled"] = "cancelled";
})(Status = exports.Status || (exports.Status = {}));
;
exports.StatusValues = Object.keys(Status).map(function (k) { return Status[k]; });
