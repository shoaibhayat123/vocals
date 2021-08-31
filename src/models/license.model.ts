import mongoose, { Schema } from 'mongoose';
import { licenseValues, licenseTypes } from './enums/licenseTypes';
import { moodValues, moodTypes } from './enums/mood';
import { genreValues, genreTypes } from './enums/genre';

const LicenseSchema = new Schema({
    title: { type: String },
    price: { type: Number },
    currencySymbol: { type: String, default: '$' },
    usage: { type: String },
    description: { type: String },
    body: { type: String },
    active: { type: Boolean, default: true },
    type: { type: String, enum: licenseValues, default: licenseTypes.free},

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface ILicense extends mongoose.Document {
    title: string,
    price:number,
    currencySymbol:string,
    usage:string,
    description:string,
    body:string,
    active:boolean,
    type: licenseTypes,

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface ILicenseModel extends mongoose.Model<ILicense> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

LicenseSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "title",
        "price",
        "currencySymbol",
        "usage",
        "description",
        "body",
        "active"
    ];
}

LicenseSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "title",
        "price",
        "currencySymbol",
        "usage",
        "description",
        "body",
        "active",
        "deleted",
        "createdAt"
    ];
}
LicenseSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return License.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
LicenseSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return License.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const License = mongoose.model<ILicense, ILicenseModel>('License', LicenseSchema);