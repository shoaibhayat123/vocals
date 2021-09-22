import mongoose, { Schema } from 'mongoose';
import { promocodeValues, promocodeTypes } from './enums/promocode';


const PromoCodeSchema = new Schema({
    title: { type: String },
    expiryDate: { type: Date, default: null },
    type: {type: String, enum: promocodeValues},
    percentage: { type: Number},
    amount: { type: Number},



    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IPromoCode extends mongoose.Document {
    title: string,
    expiryDate: Date,
    type: promocodeTypes,
    percentage: number,
    amount: number,

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IPromoCodeModel extends mongoose.Model<IPromoCode> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

PromoCodeSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "title",
        "expiryDate",
        "type",
        "percentage",
        "amount"
    ];
}

PromoCodeSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "title",
        "expiryDate",
        "type",
        "percentage",
        "amount",
        "deleted",
        "createdAt"
    ];
}
PromoCodeSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return PromoCode.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
PromoCodeSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return PromoCode.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const PromoCode = mongoose.model<IPromoCode, IPromoCodeModel>('PromoCode', PromoCodeSchema);