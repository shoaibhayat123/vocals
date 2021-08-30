import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';
import { CONFIG } from '../models/constants';
import { Role } from '../models/enums';

/**
* Use After authorization middleware. Only allow specified roles through.
* Always allows Admins Role
*/
export function authorization(allowedRoles: Role[] = []) {
	allowedRoles.push(Role.SuperAdmin); // Always Allow Super Admins
	//allowedRoles.push(Role.Admin); // Always Allow Admins

	return (req: Request, res: Response, next: NextFunction) => {
		const requestMethod = req.method;
		const requestUrl = req.baseUrl?.split('/')[2];
		const jwt = res.locals.jwtData;
		if (!jwt) {
			// throw new ForbiddenError("No Token Provided");
			return res.status(401).send(new ForbiddenError("No Token Provided"));
		}
		if ((jwt === CONFIG.STATIC_TOKEN && requestMethod === 'GET' && requestUrl && CONFIG.mutliGETRouteModules.indexOf(requestUrl) !== -1)
			|| (jwt === CONFIG.STATIC_TOKEN && requestMethod === 'POST' && requestUrl && CONFIG.mutliPOSTRouteModules.indexOf(requestUrl) !== -1)) {
			next();
		} else {
			if (allowedRoles.indexOf(jwt.role) === -1) {
				// throw new ForbiddenError("Not authorized to use this route");
				return res.status(401).send(new ForbiddenError("Not authorized to use this route"));
			}
			res.locals.user = jwt
			next();
		}
	};
}
