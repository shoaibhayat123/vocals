"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var moment_1 = __importDefault(require("moment"));
var mongoose_1 = __importStar(require("mongoose"));
var shared_1 = require("../shared");
var enums_1 = require("./enums");
var constants_1 = require("./constants");
var UserSchema = new mongoose_1.Schema({
    role: { type: String, enum: enums_1.RoleValues, default: enums_1.Role.User },
    langPref: { type: String, enum: enums_1.LanguageValues, default: enums_1.Language.English },
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
    tracks: [{
            track: { type: mongoose_1.default.Types.ObjectId, ref: 'Track' },
            license: { type: mongoose_1.default.Types.ObjectId, ref: 'License' },
        }],
    wishList: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Track', default: null }],
    code: { type: String },
    deleted: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    password: { type: String },
    passwordUpdated: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: mongoose_1.default.Types.ObjectId, ref: 'User', default: null },
    passwordResetToken: {
        token: { type: String, default: null },
        expiry: { type: Date, default: null },
    },
    billingFullName: { type: String, default: '' },
    billingEmail: { type: String, default: '' },
    billingAdress: { type: String, default: '' },
    billingCity: { type: String, default: '' },
    billingCountry: { type: String, default: '' },
    billingZipCode: { type: String, default: '' },
});
;
UserSchema.statics.getSearchableField = function () {
    return [
        "fullName"
    ];
};
UserSchema.statics.getSearchableFields = function () {
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
};
UserSchema.statics.getClientFields = function () {
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
        "wishList",
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
};
UserSchema.statics.getClientFieldsFilter = function () {
    return exports.User.getClientFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
UserSchema.statics.getSearchableFieldFilter = function () {
    return exports.User.getSearchableField().reduce(function (map, el) { map[el] = true; return map; }, {});
};
UserSchema.statics.getSearchableFieldsFilter = function () {
    return exports.User.getSearchableFields().reduce(function (map, el) { map[el] = true; return map; }, {});
};
UserSchema.methods.createUserJwt = function () {
    var user = this;
    return shared_1.createJwt({
        data: {
            role: user.role,
            userId: this.getUserId()
        },
        maxAge: constants_1.JWT_EXPIRY_SECONDS
    });
};
UserSchema.methods.checkPassword = function (password) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, shared_1.checkPassword(password, this.password)];
                case 1:
                    isValid = _a.sent();
                    if (!(isValid && this.passwordUpdated === null || this.passwordUpdated < constants_1.CONFIG.BCRYPT_REHASH_DATE)) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.setPassword(password)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, isValid];
            }
        });
    });
};
UserSchema.methods.setPassword = function (password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = this;
                    return [4 /*yield*/, shared_1.hashPassword(password)];
                case 1:
                    _a.password = _b.sent();
                    this.passwordUpdated = new Date();
                    return [4 /*yield*/, this.save()];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
UserSchema.methods.createPasswordResetToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var User;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    User = this;
                    User.passwordResetToken.token = shared_1.randomString(32);
                    User.passwordResetToken.expiry = moment_1.default().add(2, 'days').toDate();
                    return [4 /*yield*/, User.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, User.passwordResetToken.token];
            }
        });
    });
};
UserSchema.methods.verifyPasswordResetToken = function (token) {
    var User = this;
    if (User.passwordResetToken.token === null)
        return false; // There is no token
    if (User.passwordResetToken.expiry === null)
        return false;
    if (User.passwordResetToken.token !== token)
        return false; // Token doesn't match
    if (new Date() > User.passwordResetToken.expiry)
        return false; // Token is expired
    return true;
};
UserSchema.statics.checkUserNameValidation = function (userName) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid, regexp;
        return __generator(this, function (_a) {
            isValid = false;
            regexp = new RegExp(/\s/g);
            isValid = !regexp.test(userName);
            return [2 /*return*/, isValid];
        });
    });
};
UserSchema.statics.checkEmailValidation = function (email) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid, regexp;
        return __generator(this, function (_a) {
            isValid = false;
            regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            isValid = regexp.test(email);
            return [2 /*return*/, isValid];
        });
    });
};
UserSchema.statics.checkDateValidation = function (date) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid, regexp;
        return __generator(this, function (_a) {
            isValid = false;
            regexp = moment_1.default(date, "MM-DD-YYYY").isValid();
            isValid = regexp ? moment_1.default(date, "MM-DD-YYYY").isSameOrAfter(moment_1.default(), 'day') ?
                true : false : false;
            return [2 /*return*/, isValid];
        });
    });
};
UserSchema.statics.compareDates = function (sDate, eDate) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid, regexp_s, regexp_e;
        return __generator(this, function (_a) {
            isValid = false;
            regexp_s = this.checkDateValidation(sDate);
            regexp_e = this.checkDateValidation(eDate);
            isValid = regexp_s && regexp_e ? moment_1.default(eDate, "MM-DD-YYYY").isSameOrAfter(moment_1.default(sDate, "MM-DD-YYYY"), 'day') ?
                true : false : false;
            return [2 /*return*/, isValid];
        });
    });
};
UserSchema.statics.checkPhoneValidation = function (phone) {
    return __awaiter(this, void 0, void 0, function () {
        var isValid, regexp;
        return __generator(this, function (_a) {
            isValid = false;
            regexp = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
            isValid = regexp.test(phone);
            return [2 /*return*/, isValid];
        });
    });
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
exports.User = mongoose_1.default.model('User', UserSchema);
