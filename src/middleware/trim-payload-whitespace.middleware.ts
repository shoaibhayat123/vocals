import { Request, Response, NextFunction } from 'express';
/**
* Calls .trim() on all root fields which are strings of the request payload
*/
export function trimBodyWhiteSpace(req: Request, _: Response, next: NextFunction){
	const payload = req.body;
	for(let key of Object.keys(payload)){
		const keyType = typeof payload[key];
		if(keyType === 'string'){
			payload[key] = payload[key].trim();
		}else{
		}
	}
	next();
}
export function trimQueryWhiteSpace(req: Request, _: Response, next: NextFunction){
	const query = req.query as any;
	for(let key of Object.keys(query)){
		const keyType = typeof query[key];
		if(keyType === 'string'){
			query[key] = query[key].trim();
		}else{
		}
	}
	next();
}
