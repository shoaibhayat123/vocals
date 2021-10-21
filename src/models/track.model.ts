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
    stemUrl: { type: String },
    wavUrl: { type: String },
    taggedMp3Url: { type: String },
    untaggedMp3Url: { type: String },
    licenses: [{ type: mongoose.Types.ObjectId, ref: 'License', default: null }],
    allowDownload: { type: Boolean, default:false},


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
    licenses: String[],
    releaseDate: Date,
    description: string,
    imageUrl: string,
    wavUrl: string | undefined,
    untaggedMp3Url: string,
    taggedMp3Url: string,
    stemUrl: string,
    allowDownload:boolean,
    

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
    ];
}

TrackSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "title",
        "mood",
        "bpm",
        "genre",
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