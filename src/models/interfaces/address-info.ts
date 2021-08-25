export interface IAddress {
    phone_1: string,
    phone_2: string,
    city: string,
    state: string,
    country: string,
    address: string,
    postalCode: string,
    lat: Number,
    lang: Number,
    isActive?: boolean,
    createdAt?: Date,
}