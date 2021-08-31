import moment from 'moment';
import mongoose, { Schema } from 'mongoose';

import { createJwt, randomString, hashPassword, checkPassword } from '../shared';
import { Role, RoleValues, Language, LanguageValues } from './enums';
import { CONFIG, JWT_EXPIRY_SECONDS } from './constants';

const UserSchema = new Schema({
    role: { type: String, enum: RoleValues, default: Role.User },
    langPref: { type: String, enum: LanguageValues, default: Language.English },

    fullName: { type: String },
    userName: { type: String },
    phone_1: { type: String },
    phone_2: { type: String },
    email: { type: String },
    description: { type: String },
    gender: { type: String },
    dob: { type: Date },
    age: { type: Number },
    imageUrl: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    address: { type: String },
    isAcceptedTerm: { type: Boolean, default: false },
    license_id: { type: Schema.Types.ObjectId, ref: 'License', default:null},

    code: { type: String },

    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    password: { type: String },
    passwordUpdated: { type: Date, default: null },

    approvedAt: { type: Date, default: null },
    approvedBy: { type: mongoose.Types.ObjectId, ref: 'User', default: null },

    passwordResetToken: {
        token: { type: String, default: null },
        expiry: { type: Date, default: null },
    }
});

export interface IUser extends mongoose.Document {
    langPref: Language,
    role: Role,

    fullName: string,
    userName: string,
    phone_1: string,
    phone_2: string,
    email: string,
    description: string,
    gender: string,
    dob: Date,
    age: Number,
    imageUrl: string,
    city: string,
    state: string,
    country: string,
    address: string,
    isAcceptedTerm: boolean,
    code: string,
    license_id: string,

    deleted: boolean,
    deactivated: boolean,
    createdAt: Date,
    updatedAt: Date,
    password: string,
    passwordUpdated: Date | null,

    approvedAt: Date | null,
    approvedBy: mongoose.Types.ObjectId | string | null,

    passwordResetToken: {
        token: string | null,
        expiry: Date | null,
    },

    checkPassword: (password: string) => Promise<boolean>,
    setPassword: (password: string) => Promise<void>,
    createUserJwt: () => string,
    createPasswordResetToken: () => Promise<string>,
    verifyPasswordResetToken: (token: string) => boolean
};

export interface IUserModel extends mongoose.Model<IUser> {
    getClientFields: () => string[];
    getClientFieldsFilter: () => { [field: string]: boolean };
    getSearchableField: () => string[];
    getSearchableFieldFilter: () => { [field: string]: boolean };
    getSearchableFields: () => string[];
    getSearchableFieldsFilter: () => { [field: string]: boolean };
    checkUserNameValidation: (field: string) => boolean;
    checkEmailValidation: (field: string) => boolean;
    checkDateValidation: (field: string) => boolean;
    compareDates: (field_1: string, field_2: string) => boolean;
    checkPhoneValidation: (field: string) => boolean;
    // checkPhoneValidation: (field: string) => boolean;
    // sendVerificationCode: (field: string) => boolean;
    // codeVerify: (field: string, code: string) => boolean;	
}

UserSchema.statics.getSearchableField = function(): string[] {
    return [
        "fullName"
    ];
}
UserSchema.statics.getSearchableFields = function(): string[] {
    return [
        "_id",
        "role",
        "fullName",
        "userName",
        "email",
        "gender",
        "city",
        "state",
        "country"
    ];
}
UserSchema.statics.getClientFields = function(): string[] {
    return [
        "_id",
        "role",
        "fullName",
        "userName",
        "phone_1",
        "phone_2",
        "email",
        "description",
        "gender",
        "dob",
        "age",
        "imageUrl",
        "city",
        "state",
        "country",
        "address",
        "isAcceptedTerm",
        "license_id",
        "code",
        "approvedAt",
        "approvedBy",
        "createdAt",
    ];
}
UserSchema.statics.getClientFieldsFilter = function(): { [field: string]: true } {
    return User.getClientFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}
UserSchema.statics.getSearchableFieldFilter = function(): { [field: string]: true } {
    return User.getSearchableField().reduce((map: any, el) => { map[el] = true; return map }, {});
}
UserSchema.statics.getSearchableFieldsFilter = function(): { [field: string]: true } {
    return User.getSearchableFields().reduce((map: any, el) => { map[el] = true; return map }, {});
}

UserSchema.methods.createUserJwt = function() {
    const user = (<IUser>this);
    return createJwt({
        data: {
            role: user.role,
            userId: this.getUserId()
        },
        maxAge: JWT_EXPIRY_SECONDS
    });
};
UserSchema.methods.checkPassword = async function(password: string) {
    const isValid = await checkPassword(password, this.password);
    if (isValid && this.passwordUpdated === null || this.passwordUpdated < CONFIG.BCRYPT_REHASH_DATE) {
        await this.setPassword(password);
    }
    return isValid;
};
UserSchema.methods.setPassword = async function(password: string) {
    this.password = await hashPassword(password);
    this.passwordUpdated = new Date();
    return await this.save();
};

UserSchema.methods.createPasswordResetToken = async function() {
    const User = (<IUser>this);
    User.passwordResetToken.token = randomString(32);
    User.passwordResetToken.expiry = moment().add(2, 'days').toDate();
    await User.save();
    return User.passwordResetToken.token;
};
UserSchema.methods.verifyPasswordResetToken = function(token: string) {
    const User = (<IUser>this);
    if (User.passwordResetToken.token === null) return false; // There is no token
    if (User.passwordResetToken.expiry === null) return false;

    if (User.passwordResetToken.token !== token) return false; // Token doesn't match

    if (new Date() > User.passwordResetToken.expiry) return false; // Token is expired

    return true;
};

UserSchema.statics.checkUserNameValidation = async function(userName: string) {
    var isValid = false;
    const regexp = new RegExp(/\s/g);
    isValid = !regexp.test(userName);
    return isValid;
};
UserSchema.statics.checkEmailValidation = async function(email: string) {
    var isValid = false;
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    isValid = regexp.test(email);
    return isValid;
};
UserSchema.statics.checkDateValidation = async function(date: string) {
    var isValid = false;
    const regexp = moment(date, "MM-DD-YYYY").isValid();
    isValid = regexp ? moment(date, "MM-DD-YYYY").isSameOrAfter(moment(), 'day') ?
        true : false : false;
    return isValid;
};
UserSchema.statics.compareDates = async function(sDate: string, eDate: string) {
    var isValid = false;
    const regexp_s = this.checkDateValidation(sDate);
    const regexp_e = this.checkDateValidation(eDate);
    isValid = regexp_s && regexp_e ? moment(eDate, "MM-DD-YYYY").isSameOrAfter(moment(sDate, "MM-DD-YYYY"), 'day') ?
        true : false : false;
    return isValid;
};
UserSchema.statics.checkPhoneValidation = async function(phone: string) {
    var isValid = false;
    const regexp = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
    isValid = regexp.test(phone);
    return isValid;
};


// UserSchema.statics.checkPhoneValidation = async function (phone: string) {
// 	// if (!validE164(phone)) {
// 	// 	return false;
// 	// }
// 	var isValid = false;
// 	await client.lookups.phoneNumbers('+92' + phone)
// 		.fetch()
// 		.then(phone_number => { console.log(phone_number.nationalFormat); isValid = true; })
// 		.catch(error => console.log(error));
// 	return isValid;
// };
// UserSchema.statics.sendVerificationCode = async function (phone: string) {
// 	var isSend = false;
// 	await client.verify.services('VAa38b27f4f6b08d2dfd8f4562caaa1fba').verifications.create({
// 		to: `+92${phone}`,
// 		channel: "sms"
// 	}).then((data) => {
// 		isSend = true;
// 	}).catch(error => console.log(error));
// 	return isSend;
// };
// UserSchema.statics.codeVerify = async function (phone: string, code: string) {
// 	var isVerify = false;
// 	await client.verify.services('VAa38b27f4f6b08d2dfd8f4562caaa1fba').verificationChecks.create({
// 		to: `+92${phone}`,
// 		code: code
// 	}).then((data) => {
// 		isVerify = true;
// 	}).catch(error => console.log(error));
// 	return isVerify;
// };

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);