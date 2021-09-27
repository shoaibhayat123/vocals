import mongoose, { Schema } from 'mongoose';
import { PromoCode, IPromoCode } from '../models/PromoCode.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";
import { promocodeTypes } from '../models/enums/promocode';


interface CreatePromoCodeParams {
    payload: {
        title?: string,
        expiryDate?: Date,
        percentage?: number,
        validForTrack?: boolean,
        validForService?: boolean,
        licenses?: String[],
    }
}

interface CreateOrUpdatePromoCodeParams {
    query: {
        search?: string
        id?: string
    },
    payload: {
        title?: string,
        expiryDate?: Date,
        percentage?: number,
        validForTrack?: boolean,
        validForService?: boolean,
        licenses?: String[],
        deleted?: boolean,
        deactivated?: boolean,

    }
}


export class PromoCodeController {
    constructor() { }

    async get(search: string, type: SearchType): Promise<IPromoCode[] | null> {
        let query = {};
        const filter = PromoCode.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query);
    }

    async getBy(search: string): Promise<IPromoCode | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreatePromoCodeParams){
        if (!payload.title || !payload.expiryDate || !payload.percentage) {
            throw new BadRequestError(`Validate fields title and expiryDate and percentage`, {
                message: `Requiered Fields title and expiryDate and percentage`,
            });
        }
        const promocode = new PromoCode({
            ...payload
        });
        await promocode.save();
        return promocode;
    }

    async edit({query,payload}: CreateOrUpdatePromoCodeParams){
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var promocode = await this._findPromoCode(query.id);
        if (promocode === null) {
            throw new NotFoundError("PromoCode not found", {
                message: 'PromoCode not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: promocode._id };
        const result = await PromoCode.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify:false
        }) as unknown as IPromoCode;
        if (result === null) {
            throw new BadRequestError('PromoCode not edited correctly, Try to edit again', {
                message: 'PromoCode not edited correctly, Try to edit again',
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
        var promocode = await this._findPromoCode(query.id);
        if (promocode === null) {
            throw new NotFoundError("PromoCode not found", {
                message: 'PromoCode not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        promocode = await PromoCode.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true,useFindAndModify:false }) as unknown as IPromoCode;
        if (promocode === null) {
            throw new BadRequestError('PromoCode not deleted correctly, Try to delete again', {
                message: 'PromoCode not deleted correctly, Try to delete again',
            });
        } else {
            return promocode;
        }
    }

    async _findPromoCode(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await PromoCode.findOne(query);
    }

    async returnGetResponse(query): Promise<IPromoCode[] | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await PromoCode.aggregate([{
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
        let data = await PromoCode.aggregate([{
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
export default new PromoCodeController();
