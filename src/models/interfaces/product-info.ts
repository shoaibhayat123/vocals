export interface IItems {
    track_id: string,
    license_id: string,
    title: string,
    imageUrl: string,
    description: string,
    currencySymbol: string,
    price: Number,
    discount: Number,
    tax: Number,
    commissionPrice: Number,
    subTotal: Number,
    isActive?: boolean,
    createdAt?: Date
}