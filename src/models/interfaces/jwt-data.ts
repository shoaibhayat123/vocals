import { Role } from '../enums';

export interface ApplicationJwtData {
    role: Role,
    userId: string | null
}

export interface Jwt {
    data: ApplicationJwtData,
    iat: number,
    exp: number,
}