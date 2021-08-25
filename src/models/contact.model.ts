import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    phone_1: { type: String },
    phone_2: { type: String },
    subject: { type: String },
    comment: { type: String },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IContact extends mongoose.Document {
    email: string,
    firstName: string,
    lastName: string,
    fullName: string,
    phone_1: string,
    phone_2: string,
    subject: string,
    comment: string,

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IContactModel extends mongoose.Model<IContact> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

ContactSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "email",
        "firstName",
        "lastName",
        "fullName"
    ];
}
ContactSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "email",
        "firstName",
        "lastName",
        "fullName",
        "phone_1",
        "phone_2",
        "subject",
        "comment",
        "createdAt"
    ];
}
ContactSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return Contact.getClientFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}
ContactSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return Contact.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const Contact = mongoose.model<IContact, IContactModel>('Contact', ContactSchema);