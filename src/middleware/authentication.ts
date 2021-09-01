import { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';
import { verifyJwt } from '../shared';
import { BadRequestError, UnauthorizedError } from '../errors';
import { Session } from '../models/session.model';
import { User } from '../models/user.model';
import { CONFIG } from '../models/constants';

/**
*	Load JWT from Authorization header to res.locals.jwtData
*/
export async function authentication(req: Request, res: Response, next: NextFunction) {
  const requestMethod = req.method;
  const requestUrl = req.baseUrl?.split('/')[2];
  if (!req.headers['authorization']) {
    return res.status(401).send(new UnauthorizedError("No credentials provided", {
      message: 'No credentials provided'
    }));
    // return next(new UnauthorizedError("No credentials provided"));
  }

  res.locals.clientId = req.headers['x-client-id'];
  const auth = req.headers['authorization'];
  const [, token] = auth.split(' '); // Split 'Bearer' from base64 string
  
  try {
    if ((token === CONFIG.STATIC_TOKEN && requestMethod === 'GET' && requestUrl && CONFIG.mutliGETRouteModules.indexOf(requestUrl) !== -1)
    || (token === CONFIG.STATIC_TOKEN && requestMethod === 'POST' && requestUrl && CONFIG.mutliPOSTRouteModules.indexOf(requestUrl) !== -1)) {
      res.locals.jwtData = token;
      httpContext.set('jwtData', token);
      next();
    } else {
      // session history
      const session = await Session.findOne({ $and: [{ token: token, isLogout: true }] }).sort('-createdAt');
      if (session !== null) {
        return res.status(401).send(new UnauthorizedError("Credentials expired", {
          message: 'Credentials expired'
        }));
      }
      const decodedToken = await verifyJwt(token);
      // user history
      const user = await User.findById({ '_id': decodedToken.data.userId }).sort('-createdAt');
      if (user === null) {
        return res.status(400).send(new BadRequestError(`Logined user not found!`, {
          message: `Logined user not found!`
        }));
      }
      // const licenses = user.tracks.map((single)=>{
      //   return single.license
      // })
      res.locals.userTracks = user.tracks
      res.locals.jwtData = decodedToken.data;
      httpContext.set('jwtData', decodedToken.data);
      next();
    }
  } catch (error) {
    // next(new UnauthorizedError("Invalid Token"));
    return res.status(401).send(new UnauthorizedError("Invalid Token", {
      message: 'Invalid Token'
    }));
  }
}

/**
*	Load JWT from Query Params to res.locals.jwtData
*/
export async function authenticationQueryParam(req: Request, res: Response, next: NextFunction) {
  if (!req.query['jwt']) {
    return res.status(401).send(new UnauthorizedError("No credentials provided", {
      message: 'No credentials provided'
    }));
    // return next(new UnauthorizedError("No credentials provided"));
  }

  const providedJwt = req.query['jwt'] as string;

  try {
    const decodedToken = await verifyJwt(providedJwt);
    res.locals.jwtData = decodedToken.data;
    next();
  } catch (error) {
    // next(new UnauthorizedError("Invalid Token"));
    return res.status(401).send(new UnauthorizedError("Invalid Token", {
      message: 'Invalid Token'
    }));
  }
}
