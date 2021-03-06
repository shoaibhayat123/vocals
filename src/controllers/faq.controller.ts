import mongoose, { Schema } from 'mongoose';
import { FAQ, IFAQ } from '../models/FAQ.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";
import { FaqCategory } from '../models/enums/faqCategory';

interface CreateFAQParams {
    payload: {
        question: string,
        answer: string,
        category: FaqCategory,
        faq_id?: string
    }
}

interface CreateOrUpdateFAQParams {
    query: {
        search?: string
        id?: string
    },
    payload: {
        question?: string,
        answer?: string,
        category?: FaqCategory,
        faq_id?: string

    }
}


export class FAQController {
    constructor() { }

    async get(search: string, type: SearchType): Promise<IFAQ[] | null> {
        let query = {};
        const filter = FAQ.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query);
    }

    async getBy(search: string): Promise<IFAQ | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateFAQParams){
        if (!payload.question || !payload.answer || !payload.category) {
            throw new BadRequestError(`Validate fields question and answer`, {
                message: `Requiered Fields question and answer`,
            });
        }
        const faq = new FAQ({
            ...payload
        });
        await faq.save();
        return faq;
    }

    async edit({query,payload}: CreateOrUpdateFAQParams){
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var faq = await this._findFAQ(query.id);
        if (faq === null) {
            throw new NotFoundError("FAQ not found", {
                message: 'FAQ not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: faq._id };
        const result = await FAQ.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify:false
        }) as unknown as IFAQ;
        if (result === null) {
            throw new BadRequestError('FAQ not edited correctly, Try to edit again', {
                message: 'FAQ not edited correctly, Try to edit again',
            });
        } else {
            return result;
        }
    }

    async delete({ query }) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var faq = await this._findFAQ(query.id);
        if (faq === null) {
            throw new NotFoundError("FAQ not found", {
                message: 'FAQ not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        faq = await FAQ.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true,useFindAndModify:false }) as unknown as IFAQ;
        if (faq === null) {
            throw new BadRequestError('FAQ not deleted correctly, Try to delete again', {
                message: 'FAQ not deleted correctly, Try to delete again',
            });
        } else {
            return faq;
        }
    }

    async _findFAQ(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await FAQ.findOne(query);
    }

    async returnGetResponse(query): Promise<IFAQ[] | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await FAQ.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: query },
                    { $sort: {category:1} },
                ],
                totalCount: [
                    { $match: query },
                    { $count: 'totalCount' }
                ]
            }
        },
        {
            $project: {
                "result": "$paginatedResult",
                "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] },
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }

    async returnGetByResponse(query): Promise<any | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await FAQ.aggregate([{
            $facet: {
                contact: [
                    { $match: query }
                ]
            }
        },
        {
            $project: {
                "contact": { $ifNull: [{ $arrayElemAt: ["$contact", 0] }, null] }
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }
}
export default new FAQController();
