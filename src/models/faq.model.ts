import mongoose, { Schema } from 'mongoose';
import { CategoryValues, FaqCategory } from './enums/faqCategory';

const FAQSchema = new Schema({
    question: { type: String },
    answer: { type: String },
    category: { type: String, enum: CategoryValues },


    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface IFAQ extends mongoose.Document {
    question: string,
    answer: string,
    category: FaqCategory,
    

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface IFAQModel extends mongoose.Model<IFAQ> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

FAQSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "question",
        "answer",
        "category"
    ];
}

FAQSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "question",
        "answer",
        "category",
        "deleted",
        "createdAt"
    ];
}
FAQSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return FAQ.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
FAQSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return FAQ.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const FAQ = mongoose.model<IFAQ, IFAQModel>('FAQ', FAQSchema);