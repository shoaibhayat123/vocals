import { IItems } from "./product-info";

export interface IOrderMenu {
    tracks: IItems[],
    totalAmount: Number,
    isActive?: boolean,
    createdAt?: Date
}