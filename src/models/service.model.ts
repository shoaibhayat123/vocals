import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema({
    title: { type: String },
    imageUrl: { type: String },
    description: { type: String },
    category: { type: String },
    price: { type: Number },
    currencySymbol: { type: String, default: '$' },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IService extends mongoose.Document {
    title: string,
    image: string,
    description: string,
    category: string,
    price: number,
    currencySymbol:string,
    

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IServiceModel extends mongoose.Model<IService> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

ServiceSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "title",
        "description",
        "category",
        "price",
    ];
}

ServiceSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "title",
        "description",
        "category",
        "price",
        "deleted",
        "createdAt"
    ];
}
ServiceSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return Service.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
ServiceSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return Service.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const Service = mongoose.model<IService, IServiceModel>('Service', ServiceSchema);