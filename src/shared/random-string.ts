import crypto from 'crypto';

export function randomString(length: number){
	let s = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0,length);
	return s;
}
