import mongoose, { Schema } from 'mongoose';
import { License, ILicense } from '../models/License.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";
import { licenseTypes } from '../models/enums/licenseTypes';

interface CreateLicenseParams {
    payload: {
    title: string,
    price:number,
    currencySymbol:string,
    usage:string,
    description:string,
    body:string,
    active:boolean,
    type: licenseTypes,
    stemUrl:boolean,
    wavUrl:boolean,
    taggedMp3Url:boolean,
    untaggedMp3Url:boolean
    }
}

interface CreateOrUpdateLicenseParams {
    query: {
        search?: string
        id?: string
    },
    payload: {
    title?: string,
    price?:number,
    currencySymbol?:string,
    usage?:string,
    description?:string,
    body?:string,
    active?:boolean,
    type?: licenseTypes,
    stemUrl?:boolean,
    wavUrl?:boolean,
    taggedMp3Url?:boolean,
    untaggedMp3Url?:boolean,

    }
}


export class LicenseController {
    constructor() { }

    async get(search: string, type: SearchType): Promise<ILicense[] | null> {
        let query = {};
        const filter = License.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query);
    }

    async getBy(search: string): Promise<ILicense | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateLicenseParams){
        if (!payload.title || !payload.price || !payload.usage) {
            throw new BadRequestError(`Validate fields question and answer`, {
                message: `Requiered Fields question and answer`,
            });
        }
        const license = new License({
            ...payload
        });
        await license.save();
        return license;
    }

    async edit({query,payload}: CreateOrUpdateLicenseParams){
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var license = await this._findLicense(query.id);
        if (license === null) {
            throw new NotFoundError("license not found", {
                message: 'license not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: license._id };
        const result = await License.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify:false
        }) as unknown as ILicense;
        if (result === null) {
            throw new BadRequestError('License not edited correctly, Try to edit again', {
                message: 'License not edited correctly, Try to edit again',
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
        var license = await this._findLicense(query.id);
        if (license === null) {
            throw new NotFoundError("License not found", {
                message: 'License not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        let result = await License.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true,useFindAndModify:false }) as unknown as ILicense;
        if (result === null) {
            throw new BadRequestError('License not deleted correctly, Try to delete again', {
                message: 'License not deleted correctly, Try to delete again',
            });
        } else {
            return result;
        }
    }

    async _findLicense(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await License.findOne(query);
    }

    async returnGetResponse(query): Promise<ILicense[] | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await License.aggregate([{
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
        let data = await License.aggregate([{
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
export default new LicenseController();
