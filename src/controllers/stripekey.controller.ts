import mongoose, { Schema } from 'mongoose';
import { StripeKey, IStripeKey } from '../models/StripeKey.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";


interface CreateStripeKeyParams {
    payload: {
        publicKey?: string,
        privateKey?: string,
    }
}

export interface CreateOrUpdateStripeKeyParams {
    query: {
        search?: string
        id?: string
    },
    payload: {
        publicKey?: string,
        privateKey?: string,

    }
}


export class StripeKeyController {
    constructor() { }

    async get(): Promise<IStripeKey[] | null> {
        let query = {};
        
        return this.returnGetResponse(query);
    }


    async create({ payload }: CreateStripeKeyParams){
        if (!payload.publicKey || !payload.privateKey) {
            throw new BadRequestError(`Validate fields publicKey and privateKey`, {
                message: `Requiered fields publicKey and privateKey`,
            });
        }
        const stripekey = new StripeKey({
            ...payload
        });
        await stripekey.save();
        return stripekey;
    }

    async edit({query,payload}: CreateOrUpdateStripeKeyParams){
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var stripekey = await this._findStripeKey(query.id);
        if (stripekey === null) {
            throw new NotFoundError("StripeKey not found", {
                message: 'StripeKey not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: stripekey._id };
        const result = await StripeKey.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify:false
        }) as unknown as IStripeKey;
        if (result === null) {
            throw new BadRequestError('StripeKey not edited correctly, Try to edit again', {
                message: 'StripeKey not edited correctly, Try to edit again',
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
        var stripekey = await this._findStripeKey(query.id);
        if (stripekey === null) {
            throw new NotFoundError("StripeKey not found", {
                message: 'StripeKey not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        stripekey = await StripeKey.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true,useFindAndModify:false }) as unknown as IStripeKey;
        if (StripeKey === null) {
            throw new BadRequestError('StripeKey not deleted correctly, Try to delete again', {
                message: 'StripeKey not deleted correctly, Try to delete again',
            });
        } else {
            return StripeKey;
        }
    }


    async _findStripeKey(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await StripeKey.findOne(query);
    }

    async returnGetResponse(query): Promise<IStripeKey[] | null> {
       
        query = { $and: [{ 'deleted': false }, query] };
        
        let data = await StripeKey.aggregate([
                 { $match: query },
                ]);
        return data;
    }

}
export default new StripeKeyController();

