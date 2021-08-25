import { ApplicationJwtData, IAuthenticatedResponse} from '.';
import { Role } from '../enums';

/**
* Express Response passed through Authentication => Authorization middleware
*/
export interface IAuthorizedResponse extends IAuthenticatedResponse{
	locals:{
		jwtData: ApplicationJwtData,
		role: Role,
	},
	json: any,
}
