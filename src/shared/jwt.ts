import jwt from 'jsonwebtoken';

import { loadEnvs } from '../shared';
import { JWT_EXPIRY_SECONDS } from '../models/constants';
import { Jwt, ApplicationJwtData } from '../models/interfaces';

// const { JWT_SECRET } = loadEnvs(["JWT_SECRET"]);
const JWT_SECRET = 'ABC1234!@#$%^^&&';


export function verifyJwt(token: string): Promise<Jwt>{
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
			if(err || !decodedToken) reject(err);
			else resolve(<Jwt>decodedToken);
		});
	});
}

export function createJwt({data, maxAge}: {data: ApplicationJwtData, maxAge?: number}): string{
	if(!maxAge) maxAge = JWT_EXPIRY_SECONDS;
	return jwt.sign({data}, JWT_SECRET, {
		expiresIn: maxAge,
		algorithm: 'HS256'
	});
}

export async function me(req, res) {
	if (req.headers && req.headers.authorization) {
		var authorization = req.headers.authorization.split(' ')[1],
			decoded;
		try {
			//   const decodedToken = await verifyJwt(token)
			// return res.status(200).send(jwt.verify(authorization, JWT_SECRET));
			return jwt.verify(authorization, JWT_SECRET);
		} catch (e) {
			// return res.status(401).send(new UnauthorizedError("Invalid Token"));
			return null;
		}
	}
	// return res.status(400).send(new BadRequestError("Required Header Auth"));
	return null;
}