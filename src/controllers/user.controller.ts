import mongoose, { Schema } from 'mongoose';
import { User, IUser } from '../models/user.model';
import { CONFIG, TEMPLATES } from '../models/constants';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError } from "../errors";
import { createJwt, randomString } from "../shared";
import { FileType, FileTypeValues, Gender, GenderValues, Role, RoleValues, SearchType, Sort, SortValues, StatusValues } from '../models/enums';
// controllers
import emailController, { EmailController } from '../controllers/email.controller';

interface CreateUserParams {
    payload: {
        role: Role,
        user_id?: string,
        fullName?: string,
        userName?: string,
        phone_1?: string,
        phone_2?: string,
        email?: string,
        password?: string,
        description?: string,
        gender?: Gender,
        dob?: Date,
        age?: Number,
        imageUrl?: string,
        city?: string,
        state?: string,
        country?: string,
        address?: string,
        isAcceptedTerm?: boolean,
        code?: string,
        heading?: string,
        title?: string,
        message?: string,
        approvedBy?: string,
        approvedAt?: Date
    }
}

interface CreateOrUpdateUserParams {
    query: {
        id?: string,
    },
    payload: {
        role?: Role,
        user_id?: string,
        fullName?: string,
        userName?: string,
        phone_1?: string,
        phone_2?: string,
        email?: string,
        description?: string,
        gender?: Gender,
        dob?: Date,
        age?: Number,
        imageUrl?: string,
        city?: string,
        state?: string,
        country?: string,
        address?: string,
        isAcceptedTerm?: boolean,
        code?: string,
        approvedBy?: string,
        approvedAt?: Date,
        deleted?: boolean,
        deactivated?: boolean
    }
}

interface UserResetPasswordParams {
    search: string,
    password: string,
    newPassword: string
}

interface UserLoginParams {
    search: string,
    password: string,
}

export class UserController {
    constructor(private emailController: EmailController) { }

    async returnGetResponse(query, role: any, sortKey, pageOptions): Promise<IUser[] | null> {
        var sort = { createdAt: -1 } as any;
        if (sortKey) {
            const index = await SortValues.indexOf(sortKey);
            if (index === -1) {
                throw new BadRequestError(`Enter valid sorting options, Should be in ${SortValues}`, {
                    message: `Enter valid sorting options, Should be in ${SortValues}`
                });
            }
            if (sortKey === Sort.ALPHA) {
                sort = { fullName: 1 };
            } else if (sortKey === Sort.DESC) {
                sort = { createdAt: 1 };
            }
        }
        if (role && role !== '') {
            query = { $and: [{ 'role': role }, query] };
        }
        query = { $and: [{ 'deleted': false }, query] };
        let data = await User.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: query },
                    // {
                    //     $lookup: {
                    //         from: 'users',
                    //         as: 'manager',
                    //         let: { user_id: '$_id' },
                    //         pipeline: [
                    //             { $addFields: { "user_id": { "$toObjectId": "$user_id" } } },
                    //             {
                    //                 $match: {
                    //                     $expr: { $and: [{ $eq: ["$user_id", "$$user_id"] }, { $ne: ["$deleted", true] }] }
                    //                 }
                    //             }]
                    //     }
                    // },
                    { $sort: sort },
                    { $skip: (pageOptions.limit * pageOptions.page) - pageOptions.limit },
                    { $limit: pageOptions.limit },
                    { $project: { "passwordResetToken": 0, "passwordUpdated": 0, "password": 0 } }
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

    async returnGetByResponse(query, role: any): Promise<any | null> {
        if (role && role !== '') {
            query = { $and: [{ 'role': role }, query] };
        }
        query = { $and: [{ 'deleted': false }, query] };
        let data = await User.aggregate([{
            $facet: {
                user: [
                    { $match: query },
                    // {
                    //     $lookup: {
                    //         from: 'users',
                    //         as: 'manager',
                    //         let: { user_id: '$_id' },
                    //         pipeline: [
                    //             { $addFields: { "user_id": { "$toObjectId": "$user_id" } } },
                    //             {
                    //                 $match: {
                    //                     $expr: { $and: [{ $eq: ["$user_id", "$$user_id"] }, { $ne: ["$deleted", true] }] }
                    //                 }
                    //             }]
                    //     }
                    // },
                    { $project: { "passwordResetToken": 0, "passwordUpdated": 0, "password": 0 } }
                ]
            }
        },
        {
            $project: {
                "user": { $ifNull: [{ $arrayElemAt: ["$user", 0] }, null] }
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }

    async get(user: any, role: Role, search: string, type: SearchType, sortKey: Sort, pageOptions): Promise<IUser[] | null> {
        let query = {};
        if (user && user.role !== Role.Admin && role !== Role.SuperAdmin) {
            query = { $and: [{ 'role': { $ne: Role.SuperAdmin } }, { 'role': { $ne: Role.Admin } }, query] };
        }
        const filter = User.getSearchableFieldsFilter();
        if (search !== undefined && search !== '' && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query, role, sortKey, pageOptions);
    }

    async getBy(user: any, role: Role, search: string): Promise<IUser | null> {
        let query = {} as any;
        if (search && search !== '') {
            query = { _id: mongoose.Types.ObjectId(search) };
        }
        return await this.returnGetByResponse(query, role);
    }

    async me(id: string): Promise<IUser | null> {
        return await User.findById({ '_id': id }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
            + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt");
    }

    async create({ payload }: CreateUserParams, from: any) {
        // if (!payload.role || RoleValues.indexOf(payload.role) === -1 || (!payload.email && !payload.userName)
        //     || !payload.fullName) {
        //     throw new BadRequestError(`Required fileds (email or user name, role, full name). Validate fields (role -> ${RoleValues}`, {
        //         message: `Required fileds (email or user name, role, full name). Validate fields (role -> must be in ${RoleValues}`,
        //     });
        // }
        if ((!payload.role || RoleValues.indexOf(payload.role) === -1// || payload.role === Role.SuperAdmin
            || payload.role === Role.Admin) || (!payload.email && !payload.userName) || !payload.fullName) {
            throw new BadRequestError(`Required fileds (email or user name, role, full name). Validate fields (role -> ${Role.SuperAdmin}, ${Role.Admin}, ${Role.User})`, {
                message: `Required fileds (email or user name, role, full name). Validate fields (role -> must be in ${Role.SuperAdmin}, ${Role.Admin}, ${Role.User})`,
            });
        }
        if (from === 'API' && (!payload.password || !payload.isAcceptedTerm)) {
            throw new BadRequestError(`Required fileds (password, term)`, {
                message: `Required fileds (password, term)`,
            });
        }
        if (payload.gender && GenderValues.indexOf(payload.gender) === -1) {
            throw new BadRequestError(`Validate fields (gender ${GenderValues})`, {
                message: `Validate fields (gender ${GenderValues})`,
            });
        }
        if (payload.email) {
            payload.email = payload.email.toLocaleLowerCase();
            const isUnique = await this.emailIsUnique(payload.email);
            if (isUnique === false) {
                throw new BadRequestError("Cannot create user, email already in use", {
                    message: 'Cannot create user, email already in use',
                    payload,
                });
            }
        }
        if (payload.userName) {
            payload.userName = payload.userName.toLocaleLowerCase();
            const isUnique = await this.userNameIsUnique(payload.userName);
            if (isUnique === false) {
                throw new BadRequestError("Cannot create user, user name already in use", {
                    message: 'Cannot create user, user name already in use',
                    payload,
                });
            }
        }
        payload.fullName = payload.fullName.toLowerCase();
        const user = new User({
            ...payload
        });
        await user.save();
        var access_token = '';
        if (user) {
            if (payload.password) {
                const setPassword = await user.setPassword(payload.password);
            }
            access_token = await createJwt({
                data: {
                    role: user.role,
                    userId: user._id,
                }
            });
        }
        // const superAdmin = await User.findOne({ role: Role.SuperAdmin });
        // const superAdminEmail = !superAdmin ? '' : superAdmin.email;
        // const language = 'en';
        // const filename = "signup.html";
        // const heading = TEMPLATES[language]['signUp']['subject'];
        // const subject = heading;
        // payload.title = heading;
        // payload.heading = heading;
        // payload.message = 'New user sign-up or created';
        // payload.email = user.email;
        // payload.fullName = user.fullName;
        // payload.phone_1 = user.phone_1;
        // payload.role = user.role;
        // await this.emailController.send(subject, payload, superAdminEmail, '', filename, '');
        return {
            access_token,
            fullName: user.fullName,
            role: user.role,
            userId: user._id,
            langPref: user.langPref
        };
    }

    async edit(role: Role, userId: string, { query, payload }: CreateOrUpdateUserParams) {
        if (payload.gender && GenderValues.indexOf(payload.gender) === -1) {
            throw new BadRequestError(`Validate fields (gender ${GenderValues})`, {
                message: `Validate fields (gender ${GenderValues})`,
            });
        }
        const user = await User.findById({ '_id': query.id }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
            + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt");
        if (user === null) {
            throw new UnauthorizedError(`User not found against token`, {
                message: `User not found against token`,
            });
        }
        if (payload.email) {
            payload.email = payload.email.toLocaleLowerCase();
            if (user.email !== payload.email) {
                const user = await User.findOne({ 'email': payload.email }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
                    + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt");
                if (user !== null) {
                    throw new UnauthorizedError(`Email already is in use`, {
                        message: `Email already is in use`,
                    });
                }
            }
        }
        // if (payload.role && (RoleValues.indexOf(payload.role) === -1 || payload.role === Role.Client) {
        //     throw new BadRequestError(`Role must be in ${RoleValues}, but client role not valid for auth operations`, {
        //         message: `Role must be in ${RoleValues}, but client role not valid for auth operations`,
        //     });
        // }
        if ((payload.deactivated || payload.deleted)
            && role !== Role.SuperAdmin && role !== Role.Admin) {
            payload.deactivated = user.deactivated;
            payload.deleted = user.deleted;
        }
        payload.role = user.role;
        payload.email = !payload.email ? user.email : payload.email.toLowerCase();
        payload.fullName = !payload.fullName ? user.fullName : payload.fullName.toLowerCase();
        const updateDoc = {
            ...payload
        };
        const _query = { _id: user._id };
        const result = await User.findOneAndUpdate(_query, updateDoc, {
            upsert: true, new: true,useFindAndModify:false, select: "langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
                + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt"
        }) as unknown as IUser;
        return result;
    }

    async login({ search, password }: UserLoginParams) {
        if (!search) {
            throw new BadRequestError('Email or User Name required', {
                message: 'Email or User Name required',
            });
        }
        if (!password) {
            throw new BadRequestError('Password required', {
                message: 'Password required',
            });
        }
        const user = await this.findUser(search.toLocaleLowerCase());
        if (user === null) {
            throw new UnauthorizedError("Invalid user", {
                message: 'Invalid user',
            });
        }
        if (user.deactivated === true) {
            throw new ForbiddenError("Account Deactivated", {
                message: 'Account Deactivated',
            });
        }
        if (!(await user.checkPassword(password))) {
            throw new UnauthorizedError("Invalid password", {
                message: 'Invalid password',
            });
        }
        const access_token = await createJwt({
            data: {
                role: user.role,
                userId: user._id
            }
        });
        return {
            access_token,
            fullName: user.fullName,
            role: user.role,
            userId: user._id,
            langPref: user.langPref
        };
    }

    public async send(email) {
        const user = await User.findOne({ "email": email }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
            + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt");
        if (user === null) {
            throw new NotFoundError(`User not found`, {
                message: `User not found`,
            });
        }
        let code = randomString(6);
        const language = 'en';
        const message = 'Your confirmation code is here';
        const heading = TEMPLATES[language]['sendCode']['subject'];
        const payload = { heading: heading, title: heading, message: message, code: code }
        const subject = heading;
        const filename = "code.html";
        await this.emailController.send(subject, payload, user.email, '', filename, '');
        user.code = code;
        const _query = { _id: user.id };
        const result = await User.findOneAndUpdate(_query, user, { upsert: true, new: true,useFindAndModify:false }) as unknown as IUser;
        return result;
    }

    public async verifyUserCode(email: any, code: any) {
        const user = await User.findOne({ $and: [{ "email": email }, { "code": code }] });
        if (user === null) {
            throw new BadRequestError(`Invalid Code`, {
                message: `Invalid Code`,
            });
        }
        return await user.createPasswordResetToken();
    }

    public async verifyUserResetToken(resetToken: any) {
        const user = await User.findOne({ "passwordResetToken.token": resetToken });
        if (user === null) {
            throw new NotFoundError(`User not found`, {
                message: `User not found`,
            });
        }
        if (user.verifyPasswordResetToken(resetToken) === true) {
            return user;
        } else {
            return null;
        }
    }

    async setPassword({ search, password }: UserLoginParams) {
        const user = await this._findUser(search);
        if (user === null) {
            throw new NotFoundError(`User not found against search (${search})`, {
                message: `User not found against search (${search})`,
            });
        }
        if (!password) {
            throw new BadRequestError('Password required', {
                message: 'Password required',
            });
        }
        if (user.password) {
            throw new UnauthorizedError('User first password already set', {
                message: 'User first password already set',
            });
        }
        const setPassword = await user.setPassword(password);
        const access_token = await createJwt({
            data: {
                role: user.role,
                userId: user._id,
            }
        });
        return {
            access_token,
            fullName: user.fullName,
            role: user.role,
            userId: user._id,
            langPref: user.langPref
        };
    }

    async forgetPassword({ search, password }: UserLoginParams) {
        const user = await this._findUser(search);
        if (user === null) {
            throw new NotFoundError(`User not found against search (${search})`, {
                message: `User not found against search (${search})`,
            });
        }
        if (!password) {
            throw new BadRequestError('Password required', {
                message: 'Password required',
            });
        }
        const setPassword = await user.setPassword(password);
        return {
            role: user.role,
            langPref: user.langPref
        };
    }

    async resetPassword({ search, password, newPassword }: UserResetPasswordParams) {
        const user = await this._findUser(search);
        if (user === null) {
            throw new UnauthorizedError(`User not found`, {
                message: `User not found`,
            });
        }
        if (!password) {
            throw new BadRequestError('Password required', {
                message: 'Password required',
            });
        }
        if (!newPassword) {
            throw new BadRequestError('New password required', {
                message: 'New password required',
            });
        }
        if (!(await user.checkPassword(password))) {
            throw new BadRequestError("Wrong old password", {
                message: 'Wrong old password',
            });
        }
        const setPassword = await user.setPassword(newPassword);
        const access_token = await createJwt({
            data: {
                role: user.role,
                userId: user._id,
            }
        });
        return {
            access_token,
            fullName: user.fullName,
            role: user.role,
            userId: user._id,
            langPref: user.langPref
        };
    }

    async notifyNewUser(email: string) {
        const user = await User.findOne({ email }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
            + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt");
        if (user === null) throw new InternalServerError("Something went wrong while creating user", {
            message: 'Something went wrong while creating user',
        });
        // const passwordResetToken = await user.createPasswordResetToken();
        // this.emailController.sendNewUserEmail({ user, passwordResetToken });
    }

    async _findUser(search: string) {
        const query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }, { 'email': search }, { 'userName': search }] };
        return await User.findOne(query);
    }

    async findUser(search: string) {
        const query = { $or: [{ 'email': search }, { 'userName': search }] };
        return await User.findOne(query);
    }

    async findUserWithRole(search: string, role: Role) {
        const query = { $and: [{ '_id': mongoose.Types.ObjectId(search) }, { 'role': role }, { 'deleted': false }] };
        return await User.findOne(query)
    }

    async phoneIsUnique(phone: string) {
        return (await User.findOne({ phone })) === null;
    }

    async emailIsUnique(email: string) {
        const isValidEmail = await User.checkEmailValidation(email);
        if (isValidEmail === false) {
            throw new BadRequestError("Cannot create user, email format is not valid", {
                message: 'Cannot create user, email format is not valid'
            });
        }
        return (await User.findOne({ email })) === null;
    }

    async userNameIsUnique(userName: string) {
        const isValidUserName = await User.checkUserNameValidation(userName);
        if (isValidUserName === false) {
            throw new BadRequestError("Cannot create user, user name format or remove space is not valid", {
                message: 'Cannot create user, user name format or remove space is not valid'
            });
        }
        return (await User.findOne({ userName })) === null;
    }
}

export default new UserController(emailController);