import mongoose, { Schema } from 'mongoose';
import { Track, ITrack } from '../models/Track.model';
import { Role, SearchType, Sort, SortValues } from '../models/enums';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError, ConflictError } from "../errors";
import { genreTypes } from '../models/enums/genre';
import { moodTypes } from '../models/enums/mood';
import { bpmTypes } from '../models/enums/bpm';

interface CreateTrackParams {
    payload: {
    title: string,
    genre: genreTypes,
    mood: moodTypes,
    bpm: bpmTypes,
    releaseDate: Date,
    description: string,
    imageUrl: string,
    wavUrl: string | undefined,
    untaggedMp3Url: string,
    taggedMp3Url: string,
    stemUrl: string,
    belongsTo: mongoose.Types.ObjectId | string | null,
    }
}

export interface CreateOrUpdateTrackParams {
    query: {
        search?: string
        id?: string
    },
    payload: {
    title: string,
    genre?: genreTypes,
    mood?: moodTypes,
    bpm?: bpmTypes,
    releaseDate?: Date,
    description?: string,
    imageUrl?: string,
    wavUrl: string| undefined,
    untaggedMp3Url: string,
    taggedMp3Url: string,
    stemUrl: string,
    belongsTo?: string,

    }
}


export class TrackController {
    constructor() { }

    async get(search: string, type: SearchType, sortKey: Sort, pageOptions): Promise<ITrack[] | null> {
        let query = {};
        const filter = Track.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query, sortKey, pageOptions);
    }

    async getBy(search: string): Promise<ITrack | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateTrackParams){
        if (!payload.title || !payload.bpm || !payload.genre || !payload.mood) {
            throw new BadRequestError(`Validate fields title, bpm, genre and mood`, {
                message: `Requiered Fields title, bpm, genre and mood`,
            });
        }
        const track = new Track({
            ...payload
        });
        await track.save();
        return track;
    }

    async edit({query,payload}: CreateOrUpdateTrackParams){
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var track = await this._findTrack(query.id);
        if (track === null) {
            throw new NotFoundError("Track not found", {
                message: 'Track not found',
                i18n: 'notFound'
            });
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: track._id };
        const result = await Track.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true, useFindAndModify:false
        }) as unknown as ITrack;
        if (result === null) {
            throw new BadRequestError('Track not edited correctly, Try to edit again', {
                message: 'Track not edited correctly, Try to edit again',
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
        var track = await this._findTrack(query.id);
        if (track === null) {
            throw new NotFoundError("Track not found", {
                message: 'Track not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        track = await Track.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true,useFindAndModify:false }) as unknown as ITrack;
        if (track === null) {
            throw new BadRequestError('Track not deleted correctly, Try to delete again', {
                message: 'Track not deleted correctly, Try to delete again',
            });
        } else {
            return track;
        }
    }

    async _findTrack(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Track.findOne(query);
    }

    async returnGetResponse(query, sortKey, pageOptions): Promise<ITrack[] | null> {
        var sort = { createdAt: -1 } as any;
        if (sortKey) {
            const index = await SortValues.indexOf(sortKey);
            if (index === -1) {
                throw new BadRequestError(`Enter valid sorting options, Should be in ${SortValues}`, {
                    message: `Enter valid sorting options, Should be in ${SortValues}`,
                    i18n: 'notExist'
                });
            }
            if (sortKey === Sort.ALPHA) {
                sort = { name: 1 };
            } else if (sortKey === Sort.DESC) {
                sort = { createdAt: 1 };
            }
        }
        query = { $and: [{ 'deleted': false }, query] };
        
        let data = await Track.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: query },
                    { $sort: sort },
                    { $skip: (pageOptions.limit * pageOptions.page) - pageOptions.limit },
                    { $limit: pageOptions.limit }
                ],
                totalCount: [
                    { $match: query },
                    { $count: 'totalCount' }
                ]
            }
        },
        {
            $project: {
                "paginatedResult": "$paginatedResult",
                "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] },
            }
        }]);
         data = data.length > 0 ? data[0] : null;
        return data;
    }

    async returnGetByResponse(query): Promise<any | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Track.find(
            query
        );
        //data = data.length > 0 ? data[0] : null;
        return data;
    }
}
export default new TrackController();

