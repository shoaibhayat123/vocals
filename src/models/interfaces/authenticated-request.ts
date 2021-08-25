import { Response } from 'express';
import { ApplicationJwtData } from '.';

/**
* Express Response passed through Authentication middleware
*/
export interface IAuthenticatedResponse extends Response{
	locals:{
		jwtData: ApplicationJwtData
	},
	body: any,
	query: any,
	params: any,
}
