import mongoose, { Schema } from 'mongoose';
import { CONFIG, TEMPLATES } from '../models/constants';
import { UnauthorizedError, BadRequestError, InternalServerError, NotFoundError, ForbiddenError } from "../errors";
// models
import { Role, SearchType, Sort, SortValues, Status, StatusValues } from '../models/enums';
import { Order, IOrder } from '../models/order.model';
import { User } from '../models/user.model';
import { IOrderMenu } from '../models/interfaces/order-info';
// controllers
import emailController, { EmailController } from '../controllers/email.controller';
import { IItems } from '../models/interfaces/product-info';
import { Track } from '../models/Track.model';
import { License } from '../models/License.model';

interface CreateOrderParams {
    query: {
        userId: string,
    },
    payload: {
    customer_id?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    payerEmail?: string,
    token_id?: string,
    phone?: string,
    currencySymbol?: string,
    subTotalAmount?: Number,
    totalAmount?: Number,
    recieveAmount?: Number,
    returnAmount?: Number,
    discount?: Number,
    tax?: Number,
    promoCode?: string,
    code?: string,
    specialNote?: string,
    imageUrls?: String[],
    paymentMethod?: string,
    status?: string,
    tracks?: IItems[],
    checkoutAt?: Date,
    completedAt?: Date,
    cancelledAt?: Date,
    deleted?: boolean,
    deactivated?: boolean,
    createdAt?: Date,
    updatedAt?: Date
    }
}

interface CreateOrUpdateOrderParams {
    query: {
        id?: string,
        userId: string,
    },
    payload: {
        customer_id?: string,
        firstName?: string,
        lastName?: string,
        email?: string,
        payerEmail?: string,
        token_id?: string,
        phone?: string,
        currencySymbol?: string,
        subTotalAmount?: Number,
        totalAmount?: Number,
        recieveAmount?: Number,
        returnAmount?: Number,
        discount?: Number,
        tax?: Number,
        promoCode?: string,
        code?: string,
        specialNote?: string,
        imageUrls?: String[],
        paymentMethod?: string,
        status?: string,
        tracks?: IItems[],
        checkoutAt?: Date,
        completedAt?: Date,
        cancelledAt?: Date,
    
        billingFullName?: string,
        billingEmail?: string,
        billingAdress?: string,
        billingCity?: string,
        billingState?: string,
        billingZipCode?: string,
    
    
        deleted?: boolean,
        deactivated?: boolean,
        createdAt?: Date,
        updatedAt?: Date
    }
}

export class OrderController {
    constructor(private emailController: EmailController) { }

    async returnGetResponse(user: any, query, sortKey, pageOptions): Promise<IOrder[] | null> {
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
                sort = { title: 1 };
            } else if (sortKey === Sort.DESC) {
                sort = { createdAt: 1 };
            }
        }
        query = { $and: [{ 'deleted': false }, { status: { $ne: Status.pending } }, query] };
        var _query = {};
        // if (user !== null && user.role === Role.Rider) {
        //     _query = { 'delivery.rider_id': mongoose.Types.ObjectId(user.userId) };
        // }
        let data = await Order.aggregate([{
            $facet: {
                paginatedResult: [
                    { $match: query },   
                    { $sort: sort },
                    { $skip: (pageOptions.limit * pageOptions.page) - pageOptions.limit },
                    { $limit: pageOptions.limit }
                ],
                totalCount: [
                    { $match: { $and: [query, _query] } },
                    { $count: 'totalCount' }
                ]
            }
        },
        {
            $project: {
                "paginatedResult": "$paginatedResult",
                "totalCount": { $ifNull: [{ $arrayElemAt: ["$totalCount.totalCount", 0] }, 0] }
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }

    async returnGetByResponse(user: any, query): Promise<any | null> {
        query = { $and: [{ 'deleted': false }, query] };
        var _query = {};
        // if (user !== null && user.role === Role.Rider) {
        //     _query = { 'delivery.rider_id': mongoose.Types.ObjectId(user.userId) }
        // }
        let data = await Order.aggregate([{
            $facet: {
                order: [
                    { $match: query },
                ]
            }
        },
        {
            $project: {
                "order": { $ifNull: [{ $arrayElemAt: ["$order", 0] }, null] }
            }
        }]);
        data = data.length > 0 ? data[0] : null;
        return data;
    }

    async get(user: any, search: string, type: SearchType, sortKey: Sort, pageOptions): Promise<IOrder[] | null> {
        let query = {};
        if (user.role !== Role.SuperAdmin && user.role !== Role.Admin) {
            query = { role: user.role };
        }
        const filter = Order.getSearchableFieldsFilter();
        if (search !== undefined && typeof search === 'string') {
            const searchRegExp = new RegExp(search.split(' ').join('|'), 'ig');
            const searchableFields = Object.keys(filter).filter(f => f !== "_id");
            query['$or'] = searchableFields.map(field => {
                return !type ? { [field]: search } : type === SearchType.Multi ? { [field]: searchRegExp } : { [field]: search };
            })
        }
        return this.returnGetResponse(user, query, sortKey, pageOptions);
    }

    async getBy(user: any, search: string): Promise<IOrder | null> {
        let query = { _id: mongoose.Types.ObjectId(search) } as any;
        if (user.role !== Role.SuperAdmin && user.role !== Role.Admin) {
            query = { $and: [{ role: user.role }, query] };
        }
        
        // let query = {};
        // const filter = Order.getSearchableFieldsFilter();
        // if (search !== undefined && typeof search === 'string') {
        //     const searchableFields = Object.keys(filter).filter(f => f !== "id");
        //     query['$or'] = searchableFields.map(field => {
        //         return { [field]: search };
        //     })
        // }
        // query = { $and: [{ 'deleted': false }, query] };
        // return Order.findOne(query, Order.getClientFieldsFilter());
        return await this.returnGetByResponse(user, query);
    }

    async myCart(user: any): Promise<IOrder | null> {
        // const statuses = [Status.pending, Status.confirmed, Status.ready, Status.process, Status.assigned];
        const statuses = [Status.pending];
        let query = { customer_id: mongoose.Types.ObjectId(user.userId) } as any;
        query = { $and: [{ status: { $in: statuses } }, query] };
        return await this.returnGetByResponse(user, query);
    }

    async myOrders(user: any): Promise<IOrder | null> {
        let query = { customer_id: mongoose.Types.ObjectId(user.userId) } as any;
        return await this.returnGetByResponse(user, query);
    }

    async create({ query, payload }: CreateOrderParams) {
        if (!query.userId) {
            throw new BadRequestError('Required params (userId)', {
                message: 'Required params (userId)',
            });
        }
        if (!payload.tracks || payload.tracks.length < 1) {
            throw new BadRequestError('Required fileds (products)', {
                message: 'Required fileds (products)',
            });
        }
        const customer = await this.findCustomer(query.userId);
        if (customer === null) {
            throw new BadRequestError(`User or Customer not found!`, {
                message: `User or Customer not found!`,
            });
        }
        payload.customer_id = customer._id;
        var order = await this._findOrder(customer._id);
        // if (order !== null && (order.status !== Status.completed && order.status !== Status.rider_cancelled
        //     && order.status !== Status.user_cancelled)) {
        // if (order !== null && (order.status === Status.pending)) {
        //     throw new BadRequestError(`You can't place new order against customer ${payload.customer_id}`, {
        //         message: `You can't place new order against customer ${payload.customer_id}`,
        //     });
        // }
        const tracks = await this.addProducts(payload.tracks);
        if (tracks === null) {
            throw new BadRequestError('Required song not added correctly', {
                message: 'Required song not added correctly',
            });
        }
        payload.tracks = tracks.tracks;
        // calculation start
        payload.discount = payload.discount ? payload.discount : 0;
        payload.tax = payload.tax ? payload.tax : 0;
        const amount = parseFloat(parseFloat(tracks.totalAmount.toString()).toFixed(2));
        payload.subTotalAmount = amount;
        const discount = (amount * parseFloat(payload.discount.toString())) / 100;
        const subTotal = parseFloat(((amount - discount) + parseFloat(payload.tax.toString())).toFixed(2));
        // calculation end
        if (payload.totalAmount && parseFloat(parseFloat(payload.totalAmount.toString()).toFixed(2)) !== subTotal) {
            throw new BadRequestError('Order total is wrong', {
                message: 'Order total is wrong',
            });
        }
        payload.totalAmount = subTotal;
        order = new Order({
            ...payload
        });
        order = await order.save();
        // const filename = "order.html";
        // const restaurantUser = await User.findById(restaurant.userId);
        // const superAdmin = await User.findOne({ role: Role.SuperAdmin });
        // const restaurantEmail = !restaurantUser ? '' : restaurantUser.isPending ? restaurantUser.isPending === true ? restaurantUser.email : '' : '';
        // const superAdminEmail = !superAdmin ? '' : superAdmin.isPending ? superAdmin.isPending === true ? superAdmin.email : '' : '';
        // const message = 'Order is in pending';
        // await this.send('orderPending', customer.email, [superAdminEmail, restaurantEmail], message, filename);
        return order;
    }

    async edit(role: Role, { query, payload }: CreateOrUpdateOrderParams) {
        var imageUrls:[string] = [''];
        if (!query.id || mongoose.Types.ObjectId.isValid(query.id) === false) {
            throw new BadRequestError('Required fileds (id) OR Validate fields (id)', {
                message: 'Required fileds (id) OR Validate fields (id)',
            });
        }
        if (payload.status === Status.completed && (!payload.imageUrls || payload.imageUrls ?.length < 1)) {
            throw new BadRequestError('Required fileds (imageUrl)', {
                message: 'Required fileds (imageUrl)',
            });
        }
        imageUrls = payload.imageUrls ? payload.imageUrls.length > 0 ? payload.imageUrls : [] : [] as any;
        const q = { _id: mongoose.Types.ObjectId(query.id) };
        const order = await Order.findOne(q);
        if (order === null) {
            throw new BadRequestError(`Order not found against ${query.id}`, {
                message: `Order not found against ${query.id}`,
            });
        }
        if (role !== Role.SuperAdmin && role !== Role.Admin && query.userId.toString() !== order.customer_id.toString()) {
            throw new BadRequestError(`This order is not valid or oder id is not valid against your orders`, {
                message: `This order is not valid or oder id is not valid against your orders`,
            });
        }
        if (order.status === Status.completed || order.status === Status.cancelled) {
            throw new BadRequestError(`Order has been ${order.status}`, {
                message: `Order has been ${order.status}`,
            });
        }
        const tracks = await this.addProducts(order.tracks);
        if (tracks === null) {
            throw new BadRequestError('Required products or track not added correctly', {
                message: 'Required products or product not added correctly',
            });
        }
        payload.tracks = tracks.tracks;
        const customer = await this.findCustomer(order.customer_id);
        if (customer === null) {
            throw new BadRequestError(`User or Customer not found!`, {
                message: `User or Customer not found!`,
            });
        }
        payload.email = payload.email ? payload.email : customer.email;
        payload.phone = payload.phone ? payload.phone : customer.phone_1;
        if (payload.email) {
            payload.email = payload.email.toLocaleLowerCase();
            const isValidEmail = await User.checkEmailValidation(payload.email);
            if (isValidEmail === false) {
                throw new BadRequestError("Cannot create user, email format is not valid", {
                    message: 'Cannot create user, email format is not valid',
                    i18n: 'emailIsNotValid'
                });
            }
        }
        // }
        // calculation start
        payload.discount = payload.discount ? payload.discount : order.discount;
        payload.tax = payload.tax ? payload.tax : order.tax;
        const amount = parseFloat(parseFloat(tracks.totalAmount.toString()).toFixed(2));
        payload.subTotalAmount = amount;
        const discount = (amount * parseFloat(payload.discount.toString())) / 100;
        const subTotal = parseFloat(((amount - discount) + parseFloat(payload.tax.toString())).toFixed(2));
        // calculation end
        if (payload.totalAmount && parseFloat(parseFloat(payload.totalAmount.toString()).toFixed(2)) !== subTotal) {
            throw new BadRequestError('Order total is wrong', {
                message: 'Order total is wrong',
            });
        }
        payload.totalAmount = subTotal;
        if (payload.status) {
            if ((payload.status !== order.status) && (StatusValues.indexOf(payload.status) === -1)) {
                throw new BadRequestError('Select valid status', {
                    message: 'Select valid status',
                });
            }
        }
        if (payload.status === Status.cancelled) {
            payload.cancelledAt = new Date();
        } else if (payload.status === Status.checkout) {
            payload.billingEmail = payload.payerEmail ?.toLowerCase();
            payload.checkoutAt = new Date();
        } else if (payload.status === Status.completed) {
            payload.imageUrls = imageUrls;
            payload.completedAt = new Date();
        }
        const updateDoc = {
            ...payload
        };
        const _query = { _id: query.id };
        const result = await Order.findOneAndUpdate(_query, order.status !== Status.pending ? order : updateDoc, { upsert: true, new: true, useFindAndModify:false  }) as unknown as IOrder;
        // const admins = await User.find({ $or: [{ role: Role.SuperAdmin }, { role: Role.Admin }] });
        // let adminEmails = [] as any;
        // if (admins.length > 0) {
        //     adminEmails = admins.map(u => u.email);
        // }
        // const filename = "order.html";
        // if (payload.status === Status.checkout) {
        //     const message = 'Order payment done or Order succesfully checkout';
        //     await this.send('orderCheckout', { amount: order.totalAmount, payorEmail: payload.payerEmail }, customer.email, adminEmails, message, filename);
        // } else if (payload.status === Status.completed) {
        //     const message = `Order is delivered or completed`;
        //     await this.send('orderCompleted', { amount: order.totalAmount, payorEmail: order.payerEmail }, customer.email, adminEmails, message, filename);
        // }
        return result;
    }

    async send(templateName, body, to, cc, message, fileName) {
        const language = 'en';
        const heading = TEMPLATES[language][templateName]['subject'];
        var payload = {} as any;
        payload.heading = heading;
        payload.title = heading;
        payload.message = message;
        payload.payorEmail = body.payorEmail;
        payload.amount = body.amount;
        const subject = heading;
        await this.emailController.send(subject, payload, to, cc, fileName, '');
        // const sendEmail = await this.emailController.sendMailgunTemplate({
        //     templateName: templateName,
        //     to: to,
        //     cc: cc,
        //     language: 'en',
        //     params: {
        //         message
        //     }
        // });
    }

    async addProducts(tracks: IItems[]): Promise<IOrderMenu | null> {
        var newTracks = [] as any;
        var totalAmount = 0;
        var index = 0;
        for (let track of tracks) {
            if (!track.track_id) {
                throw new BadRequestError('Required fileds (menu_id, quantity)', {
                    message: 'Required fileds (menu_id, quantity)',
                });
            }
            var current = await this.findTrack(track.track_id) as any;
            var license = await this.findLicense(track.license_id) as any;
            const newTrack = {} as IItems;
            newTrack.track_id = current._id;
            newTrack.license_id = license._id;
            newTrack.title = current.title;
            newTrack.imageUrl = current.imageUrl;
            newTrack.price = license.price;
            newTrack.discount = track.discount ? track.discount : 0;
            newTrack.tax = track.tax ? track.tax : 0;
            // newTrack.commissionPrice = track.commissionPrice ? track.commissionPrice : 0;
            newTrack.description = track.description ? track.description : '';
            // calculation start
            const amount = parseFloat(newTrack.price.toString())// * parseInt(newTrack.quantity.toString());
            const discount = (amount * parseFloat(newTrack.discount.toString())) / 100;
            // const tax = (amount * parseFloat(newTrack.tax.toString())) / 100;
            const subTotal = parseFloat(((amount - discount) + parseFloat(newTrack.tax.toString())).toFixed(2));
            // calculation end
            newTrack.subTotal = subTotal;
            totalAmount = totalAmount + subTotal;
            newTracks.push(newTrack);
            index = index + 1;
        }
        const result: IOrderMenu = {
            tracks: newTracks,
            totalAmount: totalAmount
        }
        return result;
    }
    async getCountOfTracksDownloaded(){
        let data = await Order.aggregate([ {$match: {"tracks":{$exists:true}}},
        {
            $project: {
                totalTracks: { $size: "$tracks" },
                totalAmountSpent : {$sum: "$totalAmount"}
            },
        },{ $group: {
            "_id": null,
            "totalTracksDownloaded": {
                "$sum": "$totalTracks"
            },
            "totalAmountSpent":{
                "$sum": "$totalAmountSpent"
            }
        } }]);
        //data = data.length > 0 ? data[0] : null;
        return data;
    }

    async _findOrder(search: string) {
        const query = { $or: [{ '_id': mongoose.Types.ObjectId(search) }, { 'customer_id': mongoose.Types.ObjectId(search) }] } as any;
        return await Order.findOne(query);
    }

    async findOrder(search: string) {
        const query = { $or: [{ 'customer_id': mongoose.Types.ObjectId(search) }] } as any;
        return await Order.findOne(query);
    }

    async findTrack(search: string) {
        const query = { $and: [{ '_id': mongoose.Types.ObjectId(search) }, { 'deleted': false }] } as any;
        return await Track.findOne(query);
    }

    async findLicense(search: string) {
        const query = { $and: [{ '_id': mongoose.Types.ObjectId(search) }, { 'deleted': false }] } as any;
        return await License.findOne(query);
    }

    async findCustomer(search: string) {
        const user = await User.findById({ '_id': search });
        // if (user === null || user.role !== Role.User) {
        if (user === null) {
            throw new BadRequestError(`User not exist against id ${search}`, {
                message: `User not exist against id ${search}`,
                i18n: 'isNotExist',
            });
        }
        return user;
    }

    async isNumber(n) {
        return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }
}

export default new OrderController(emailController);