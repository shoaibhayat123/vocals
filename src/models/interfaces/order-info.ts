import { IItems } from "./product-info";

export interface IOrderMenu {
    products: IItems[],
    totalAmount: Number,
    isActive?: boolean,
    createdAt?: Date
}