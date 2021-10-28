import mongoose, { Schema } from 'mongoose';
import { Status, StatusValues } from './enums';
import { PaymentMethodStatusValues,PaymentMethodStatus } from './enums/paymentMethod';
import { IItems } from './interfaces/product-info';

const OrderSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    payerEmail: { type: String },
    token_id: { type: String },
    phone: { type: String },
    currencySymbol: { type: String, default: '$' },
    subTotalAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    recieveAmount: { type: Number, default: 0 },
    returnAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    promoCode: { type: Schema.Types.ObjectId, ref: 'PromoCode' },
    code: { type: String },
    specialNote: { type: String },
    imageUrls: [{ type: String }],
    paymentMethod: { type: String, enum: PaymentMethodStatusValues },
    status: { type: String, enum: StatusValues, default: Status.pending },
    products: [{
        track_id: { type: Schema.Types.ObjectId, ref: 'Track' },
        service_id: { type: Schema.Types.ObjectId, ref: 'Service' },
        title: { type: String },
        license_id : { type: mongoose.Types.ObjectId, ref: 'License' },
        imageUrl: { type: String },
        description: { type: String },
        currencySymbol: { type: String, default: '$' },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        commissionPrice: { type: Number, default: 0 },
        subTotal: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
    }],
    checkoutAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },

    billingFullName: { type: String, default: '' },
    billingEmail: { type: String, default: '' },
    billingAdress: { type: String, default: '' },
    billingCity: { type: String, default: '' },
    billingCountry: { type: String, default: '' },
    billingZipCode: { type: String, default: '' },


    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IOrder extends mongoose.Document {
    customer_id: string,
    firstName: string,
    lastName: string,
    email: string,
    payerEmail: string,
    token_id: string,
    phone: string,
    currencySymbol: string,
    subTotalAmount: Number,
    totalAmount: Number,
    recieveAmount: Number,
    returnAmount: Number,
    discount: Number,
    tax: Number,
    promoCode: string,
    code: string,
    specialNote: string,
    imageUrls: String[],
    paymentMethod: string,
    status: string,
    products: IItems[],
    
    checkoutAt: Date,
    completedAt: Date,
    cancelledAt: Date,

    billingFullName: string,
    billingEmail: string,
    billingAdress: string,
    billingCity: string,
    billingState: string,
    billingZipCode: string,


    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IOrderModel extends mongoose.Model<IOrder> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

OrderSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "customer_id",
        "email",
        "payerEmail",
        "phone",
        "status",
        "paymentMethod"
    ];
}
OrderSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "customer_id",
        "firstName",
        "lastName",
        "email",
        "payerEmail",
        "token_id",
        "phone",
        "currencySymbol",
        "subTotalAmount",
        "totalAmount",
        "recieveAmount",
        "returnAmount",
        "discount",
        "tax",
    
        "promoCode",
        "code",
        "specialNote",
        "imageUrls",
        "paymentMethod",
        "status",
        "products",
        "checkoutAt",
        "completedAt",
        "cancelledAt",
        "billingFullName",
        "billingEmail",
        "billingAdress",
        "billingCity",
        "billingState",
        "billingZipCode",
        "createdAt",
    ];
}
OrderSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return Order.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
OrderSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return Order.getSearchableFields().reduce((map, el) => { map[el] = true; return map }, {});
}
export const Order = mongoose.model<IOrder, IOrderModel>('Order', OrderSchema);