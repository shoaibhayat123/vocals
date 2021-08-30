import mongoose, { Schema } from 'mongoose';
import { bpmValues, bpmTypes } from './enums/bpm';
import { moodValues, moodTypes } from './enums/mood';
import { genreValues, genreTypes } from './enums/genre';

const TrackSchema = new Schema({
    title: { type: String },
    genre: { type: String, enum: genreValues },
    mood: { type: String, enum: moodValues },
    bpm: { type: String, enum: bpmValues },
    releaseDate: { type: Date, default: null },
    description: { type: String },
    imageUrl: { type: String },
    trackUrl: { type: String },
    belongsTo: { type: mongoose.Types.ObjectId, ref: 'User', default: null },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface ITrack extends mongoose.Document {
    title: string,
    genre: genreTypes,
    mood: moodTypes,
    bpm: bpmTypes,
    releaseDate: Date,
    description: string,
    imageUrl: string,
    trackUrl: string,
    belongsTo: mongoose.Types.ObjectId | string | null,
    

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface ITrackModel extends mongoose.Model<ITrack> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

TrackSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "title",
        "mood",
        "bpm",
        "genre",
        "belongsTo"
    ];
}

TrackSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "title",
        "mood",
        "bpm",
        "genre",
        "belongsTo",
        "deleted",
        "createdAt"
    ];
}
TrackSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return Track.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
TrackSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return Track.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

export const Track = mongoose.model<ITrack, ITrackModel>('Track', TrackSchema);