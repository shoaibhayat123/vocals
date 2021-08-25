"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleValues = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SuperAdmin"] = "super admin";
    Role["Admin"] = "admin";
    Role["User"] = "user";
})(Role = exports.Role || (exports.Role = {}));
;
exports.RoleValues = Object.keys(Role).map(function (k) { return Role[k]; });
