import mongoose, { Schema } from 'mongoose';
import { Contact, IContact } from '../models/contact.model';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError } from "../errors";
import { Role, SearchType, Sort, SortValues } from '../models/enums';
// models
import { User } from '../models/user.model';
// controllers
import emailController, { EmailController } from '../controllers/email.controller';
import { TEMPLATES } from '../models/constants';

interface CreateContactParams {
    payload: {
        email?: string,
        firstName?: string,
        lastName?: string,
        fullName?: string,
        phone_1?: string,
        phone_2?: string,
        subject?: string,
        comment?: string,
        heading?: string,
        title?: string,
        message?: string

    }
}

interface CreateOrUpdateContactParams {
    query: {
        id?: string,
    },
    payload: {
        email?: string,
        firstName?: string,
        lastName?: string,
        fullName?: string,
        phone_1?: string,
        phone_2?: string,
        subject?: string,
        comment?: string
        deleted?: boolean,
        deactivated?: boolean
    }
}

export class ContactController {
    constructor(private emailController: EmailController) { }

    async returnGetResponse(query, sortKey, pageOptions): Promise<IContact[] | null> {
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
        let data = await Contact.aggregate([{
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
        let data = await Contact.aggregate([{
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

    async get(search: string, type: SearchType, sortKey: Sort, pageOptions): Promise<IContact[] | null> {
        let query = {};
        const filter = Contact.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(query, sortKey, pageOptions);
    }

    async getBy(search: string): Promise<IContact | null> {
        let query = { _id: mongoose.Types.ObjectId(search) };
        // let query = {};
        // const filter = Contact.getSearchableFieldsFilter();
        // if (search !== undefined && typeof search === 'string') {
        //     const searchableFields = Object.keys(filter).filter(f => f !== "id");
        //     query['$or'] = searchableFields.map(field => {
        //         return { [field]: search };
        //     })
        // }
        // query = { $and: [{ 'deleted': false }, query] };
        // return Contact.findOne(query, Contact.getClientFieldsFilter());
        return await this.returnGetByResponse(query);
    }

    async create({ payload }: CreateContactParams) {
        var isValidPhone_1 = true;
        var isValidPhone_2 = true;
        if (!payload.email || !payload.comment) {
            throw new BadRequestError('Fields required (email, comment)', {
                message: 'Fields required (email, comment)',
            });
        }
        payload.email = payload.email.toLocaleLowerCase();
        const isValidEmail = await User.checkEmailValidation(payload.email);
        if (payload.phone_1) {
            isValidPhone_1 = await User.checkPhoneValidation(payload.phone_1);
        }
        if (payload.phone_1) {
            isValidPhone_2 = await User.checkPhoneValidation(payload.phone_1);
        }
        if (isValidEmail === false || isValidPhone_1 === false || isValidPhone_2 === false) {
            throw new BadRequestError("Email or phone format is not valid", {
                message: 'Email or phone format is not valid',
                i18n: 'formatIsNotValid',
                payload,
            });
        }
        var contact = new Contact({
            ...payload
        });
        contact = await contact.save();
        const admins = await User.find({ $or: [{ role: Role.SuperAdmin }, { role: Role.Admin }] });
        const adminEmails = admins ? admins.length > 0 ? admins.map(a => a.email) : [] : [];
        const language = 'en';
        const heading = TEMPLATES[language]['contactInfo']['subject'];
        const subject = heading;
        payload.title = heading;
        payload.heading = heading;
        payload.message = '';
        const filename = "contact.html";
        await this.emailController.send(subject, payload, payload.email, adminEmails, filename, '');
        return contact;
    }

    async delete({ query }) {
        if (!query.id) {
            throw new BadRequestError('Id required', {
                message: 'Id required',
            });
        }
        var contact = await this._findContact(query.id);
        if (contact === null) {
            throw new NotFoundError("Contact not found", {
                message: 'Contact not found',
                i18n: 'notFound'
            });
        }
        const _query = { _id: query.id };
        contact = await Contact.findOneAndUpdate(_query, { 'deleted': true }, { upsert: true, new: true }) as unknown as IContact;
        if (contact === null) {
            throw new BadRequestError('Contact not deleted correctly, Try to delete again', {
                message: 'Contact not deleted correctly, Try to delete again',
            });
        } else {
            return null;
        }
    }

    async _findContact(search: string) {
        let query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }, { 'email': search }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Contact.findOne(query);
    }

    async findContact(search: string) {
        let query = { $or: [{ 'email': search }] };
        query = { $and: [{ 'deleted': false }, query] } as any;
        return await Contact.findOne(query);
    }
}

export default new ContactController(emailController);