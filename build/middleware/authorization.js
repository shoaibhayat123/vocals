"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
var errors_1 = require("../errors");
var constants_1 = require("../models/constants");
var enums_1 = require("../models/enums");
/**
* Use After authorization middleware. Only allow specified roles through.
* Always allows Admins Role
*/
function authorization(allowedRoles) {
    if (allowedRoles === void 0) { allowedRoles = []; }
    allowedRoles.push(enums_1.Role.SuperAdmin); // Always Allow Super Admins
    //allowedRoles.push(Role.Admin); // Always Allow Admins
    return function (req, res, next) {
        var _a;
        var requestMethod = req.method;
        var requestUrl = (_a = req.baseUrl) === null || _a === void 0 ? void 0 : _a.split('/')[2];
        var jwt = res.locals.jwtData;
        if (!jwt) {
            // throw new ForbiddenError("No Token Provided");
            return res.status(401).send(new errors_1.ForbiddenError("No Token Provided"));
        }
        if ((jwt === constants_1.CONFIG.STATIC_TOKEN && requestMethod === 'GET' && requestUrl && constants_1.CONFIG.mutliGETRouteModules.indexOf(requestUrl) !== -1)
            || (jwt === constants_1.CONFIG.STATIC_TOKEN && requestMethod === 'POST' && requestUrl && constants_1.CONFIG.mutliPOSTRouteModules.indexOf(requestUrl) !== -1)) {
            next();
        }
        else {
            if (allowedRoles.indexOf(jwt.role) === -1) {
                // throw new ForbiddenError("Not authorized to use this route");
                return res.status(401).send(new errors_1.ForbiddenError("Not authorized to use this route"));
            }
            res.locals.user = jwt;
            next();
        }
    };
}
exports.authorization = authorization;
