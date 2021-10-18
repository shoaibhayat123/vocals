import mongoose, { Schema } from 'mongoose';
import { Service, IService } from '../models/Service.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";

interface CreateServiceParams {
    payload: {
        title: string,
        image: string,
        description: string,
        category: string,
        price: number,
        currencySymbol:string,
        
    }
}

interface CreateOrUpdateServiceParams {
    query: {
        search?: string
        id?: string
    },
    payload: {
        title: string,
        image: string,
        description: string,
        category: string,
        price: number,
        currencySymbol:string,

    }
}


export class ServiceController {
    constructor() { }

    async get(search: string, type: SearchType): Promise<IService[] | null> {
        let query = {};
        const filter = Service.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query);
    }

    async getBy(search: string): Promise<IService | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateServiceParams){
        if (!payload.title || !payload.description || !payload.category) {
            throw new BadRequestError(`Validate fields question and answer`, {
                message: `Requiered Fields question and answer`,
            });
        }
        const service = new Service({
            ...payload
        });
        await service.save();
        return service;
    }

    async edit({query,payload}: CreateOrUpdateServiceParams){
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var service = await this._findService(query.id);
        if (service === null) {
            throw new NotFoundError("Service not found", {
                message: 'Service not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: service._id };
        const result = await Service.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify:false
        }) as unknown as IService;
        if (result === null) {
            throw new BadRequestError('Service not edited correctly, Try to edit again', {
                message: 'Service not edited correctly, Try to edit again',
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
        var service = await this._findService(query.id);
        if (service === null) {
            throw new NotFoundError("Service not found", {
                message: 'Service not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        service = await Service.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true,useFindAndModify:false }) as unknown as IService;
        if (service === null) {
            throw new BadRequestError('Service not deleted correctly, Try to delete again', {
                message: 'Service not deleted correctly, Try to delete again',
            });
        } else {
            return service;
        }
    }

    async getCountOfServices(){
        const query = { $and: [{ 'deleted': false }] };
        let data = await Service.aggregate([{
            $facet: {
                totalCount: [
                    { $match: query },
                    { $count: 'totalCount' }
                ]
            }
        },
        {
            $project: {
                "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] },
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }

    async _findService(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Service.findOne(query);
    }

    async returnGetResponse(query): Promise<IService[] | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Service.aggregate([{
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
        let data = await Service.aggregate([{
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
export default new ServiceController();
