import mongoose, { Schema } from 'mongoose';

const StripeSchema = new Schema({
    publicKey: { type: String },
    privateKey: { type: String },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IStripeKey extends mongoose.Document {
    publicKey: string,
    privateKey: string,
    

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IStripeKeyModel extends mongoose.Model<IStripeKey> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

StripeSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "publicKey",
        "privateKey",
    ];
}

StripeSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "publicKey",
        "privateKey",
        "deleted",
        "createdAt"
    ];
}
StripeSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return StripeKey.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
StripeSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return StripeKey.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const StripeKey = mongoose.model<IStripeKey, IStripeKeyModel>('StripeKey', StripeSchema);