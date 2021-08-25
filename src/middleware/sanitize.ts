import sanitize from 'mongo-sanitize';
// import { logger } from '../shared';

import { Request, Response, NextFunction} from 'express';

// Mitigate injection attacks by escaping special mongodb characters

export function sanitizeBody(req: Request, _: Response, next: NextFunction){
  // logger.silly('[sanitizeBody]: ', req.body);
  for(let k of Object.keys(req.body)){
    req.body[k] = sanitize(req.body[k]);
  }
  next();
}
export function sanitizeQuery(req: Request, _: Response, next: NextFunction){
  // logger.silly('[sanitizeQuery]: ', req.query);
  for(let k of Object.keys(req.query)){
    req.query[k] = sanitize(req.query[k]);
  }
  next();
}
export function sanitizeParams(req: Request, _: Response, next: NextFunction){
  // logger.silly('[sanitizeParams]: ', req.params);
  for(let k of Object.keys(req.params)){
    req.params[k] = sanitize(req.params[k]);
  }
  next();
}
