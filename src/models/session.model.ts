import mongoose, { Schema } from 'mongoose';

const SessionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    token: { type: String },
    ip: { type: String },
    isLogout: { type: Boolean, default: false },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export interface ISession extends mongoose.Document {
    user_id: string,
    token: string,
    ip: string,
    isLogout: boolean,

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date
};

export interface ISessionModel extends mongoose.Model<ISession> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
}

SessionSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "user_id",
        "token",
        "ip"
    ];
}
SessionSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "user_id",
        "token",
        "ip",
        "isLogout",
        "createdAt"
    ];
}
SessionSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return Session.getClientFields().reduce((map, el) => { map[el] = true; return map }, {});
}
SessionSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return Session.getSearchableFields().reduce((map, el) => { map[el] = true; return map }, {});
}
export const Session = mongoose.model<ISession, ISessionModel>('Session', SessionSchema);