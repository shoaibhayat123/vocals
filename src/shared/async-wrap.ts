import { Request, Response, NextFunction } from 'express';

export function asyncWrap<RES = Response>(routeControllerFn: (req: Request, res: RES, next: NextFunction) => Promise<any>){
  return (req: any, res: any, next: any) => {
    Promise.resolve(routeControllerFn(req, res, next)).catch(next);
  };
};
