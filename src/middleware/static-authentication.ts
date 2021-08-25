import { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';
import { verifyJwt } from '../shared';
import { UnauthorizedError } from '../errors';
const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJ1c2VyIiwidXNlcklkIjoiNWY1Yjk0YTY2YTNjYTMwMDA0YzJjZWJiIn0sImlhdCI6MTU5OTgzOTMwMiwiZXhwIjoxNjAwMDk4NTAyfQ.Fdft4zwZwOzww6Fdbk2t4UiTz1cpNSrIYrzsvddXh1U';
/**
*	Load JWT from Authorization header to res.locals.jwtData
*/
export async function staticAuthentication(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
        return res.status(401).send(new UnauthorizedError("No basic token provided", {
            message: 'No basic token provided'
        }));
        // return next(new UnauthorizedError("No credentials provided"));
    }

    res.locals.clientId = req.headers['x-client-id'];
    const auth = req.headers['authorization'];
    const [, token] = auth.split(' '); // Split 'Bearer' from base64 string

    if (token === STATIC_TOKEN) {
        res.locals.jwtData = token;
        httpContext.set('jwtData', token);
        next();
    } else {
        return res.status(401).send(new UnauthorizedError("Invalid Basic Token", {
            message: 'Invalid Basic Token'
        }));
    }
}

/**
*	Load JWT from Query Params to res.locals.jwtData
*/
export async function staticAuthenticationQueryParam(req: Request, res: Response, next: NextFunction) {
    if (!req.query['jwt']) {
        return res.status(401).send(new UnauthorizedError("No basic token provided", {
            message: 'No basic token provided'
        }));
        // return next(new UnauthorizedError("No credentials provided"));
    }

    const providedJwt = req.query['jwt'] as string;

    if (providedJwt === STATIC_TOKEN) {
        res.locals.jwtData = providedJwt;
        next();
    } else {
        return res.status(401).send(new UnauthorizedError("Invalid Basic Token", {
            message: 'Invalid Basic Token'
        }));
    }
}
