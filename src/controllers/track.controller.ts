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
    tagged: boolean,
    releaseDate: Date,
    description: string,
    imageUrl: string,
    trackUrl: string,
    belongsTo: mongoose.Types.ObjectId | string | null,
    }
}

interface CreateOrUpdateTrackParams {
    query: {
        search?: string
        id?: string
    },
    payload: {
    title: string,
    genre?: genreTypes,
    mood?: moodTypes,
    bpm?: bpmTypes,
    tagged?: boolean,
    releaseDate?: Date,
    description?: string,
    imageUrl?: string,
    trackUrl?: string,
    belongsTo?: string,

    }
}


export class TrackController {
    constructor() { }

    async get(search: string, type: SearchType): Promise<ITrack[] | null> {
        let query = {};
        const filter = Track.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query);
    }

    async getBy(search: string): Promise<ITrack | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateTrackParams){
        if (!payload.title || !payload.trackUrl || !payload.bpm || !payload.genre || !payload.mood || !payload.tagged) {
            throw new BadRequestError(`Validate fields title, trackUrl, bpm, genre, tagged and mood`, {
                message: `Requiered Fields title, trackUrl, bpm, genre, tagged and mood`,
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

    async returnGetResponse(query): Promise<ITrack[] | null> {
        query = { $and: [{ 'deleted': false }, query] };
        let data = await Track.aggregate([{
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
        let data = await Track.aggregate([{
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
export default new TrackController();

