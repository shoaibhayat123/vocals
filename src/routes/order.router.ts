import * as express from 'express';

// middleware
import { sanitizeBody, sanitizeQuery, authentication, authorization, staticAuthentication, trimQueryWhiteSpace, trimBodyWhiteSpace } from '../middleware'
// controllers
import orderController, { OrderController } from '../controllers/order.controller';
import userController, { UserController } from '../controllers/user.controller';
// routes
import userRouter, { UserRouter } from './user.router';
// model or interfaces
import { IAuthenticatedResponse, IAuthorizedResponse } from '../models/interfaces';

import { Role, Status } from '../models/enums';
import { PaymentMethodStatus } from '../models/enums/paymentMethod';
import { asyncWrap } from '../shared/async-wrap';
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from '../errors';
import { Pagination } from '../models/shared';
import { me } from '../shared';
import { CONFIG } from '../models/constants';
import { User } from '../models/user.model';
import { error } from 'console';

// payment
//const stripe = require('stripe')(CONFIG.STRIPE_SECRET_KEY_SANDBOX);
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51J7GFfBJGFaAOAxJxlhRJaqliTAhyKGK75tR7YWx5ad9TkKlaUUMbSptvPMMFA5aG3k906ZSQrzwyf7pJ7XEeAez00e5M5paBY');

export class OrderRouter {
    public router: express.Router;
    constructor(private orderController: OrderController,
        private userController: UserController,
        private userRouter: UserRouter) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }

    private async get(req, res) {
        try {
            const user = await this.userRouter.getLoginUser(req, res);
            const { search, type, sortKey } = req.query as any;
            const orders = await this.orderController.get(user, search, type, sortKey, await Pagination.pagination(req, 'O'));
            orders === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(orders);
        } catch (error: any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async getBy(req, res) {
        try {
            const user = await this.userRouter.getLoginUser(req, res);
            const { search } = req.query as any;
            const order = await this.orderController.getBy(user, search);
            order === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(order);
        } catch (error:any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async myCart(req, res) {
        try {
            const user = await this.userRouter.getLoginUser(req, res);
            const order = await this.orderController.myCart(user);
            order === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(order);
        } catch (error:any) {
            console.log('error', error);
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async myOrders(req, res) {
        try {
            const user = await this.userRouter.getLoginUser(req, res);
            const order = await this.orderController.myOrders(user);
            order === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(order);
        } catch (error:any) {
            console.log('error', error);
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async checkStripeCardValidation(req, res) {
        // if (!req.body || !req.body.card_number || !req.body.card_expire_month
        //     || !req.body.card_expire_year || !req.body.card_code || !req.body.amount
        //     || !req.body.payer_email || !req.body.payer_zipCode || !req.body.payer_country) {
        //     throw new BadRequestError('Required fileds (card_number, card_expire_month, card_expire_year, card_code, payer_email, payer_zipCode, payer_country, amount)', {
        //         message: 'Required fileds (card_number, card_expire_month, card_expire_year, card_code, payer_email, payer_zipCode, payer_country, amount)'
        //     });
        // }
        if (!req.body || !req.body.order_id || !req.body.token_id || !req.body.amount || !req.body.payer_email
            || !req.body.billingAdress || !req.body.payer_zipCode) {
            throw new BadRequestError('Required fileds (order_id, token_id, payer_email, amount, billingAdress, billingZipCode)', {
                message: 'Required fileds (order_id, token_id, payer_email, amount, billingAdress, billingZipCode)'
            });
        }
        req.body.payer_email = req.body.payer_email.toLocaleLowerCase();
        const isValidEmail = await User.checkEmailValidation(req.body.payer_email.toLocaleLowerCase());
        if (isValidEmail === false) {
            throw new BadRequestError("Cannot create user, email format is not valid", {
                message: 'Cannot create user, email format is not valid'
            });
        }
        // if (!req.body || !req.body.payment_id) {
        //     throw new BadRequestError('Required fileds (payment_id)', {
        //         message: 'Required fileds (payment_id)'
        //     });
        // }
    }

    private routes() {
        this.router.route("/get")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.get(req, res);
                }));

        this.router.route("/get-by")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.getBy(req, res);
                }));

        this.router.route("/cart")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.myCart(req, res);
                }));
        
        this.router.route("/myorders")
        .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
            asyncWrap<IAuthorizedResponse>(async (req, res) => {
                await this.myOrders(req, res);
            }));

        this.router.route("/create")
            .post(sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                    try {
                        const user = await this.userRouter.getLoginUser(req, res);
                        const order = await this.orderController.create({
                            query: { userId: user.userId },
                            payload: req.body
                        });
                        res.json({
                            order
                        });
                    } catch (error:any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/edit")
            .patch(sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    try {
                        const user = await this.userRouter.getLoginUser(req, res);
                        const { search } = req.query as any;
                        const order = await this.orderController.edit(user.role, {
                            query: { id: search, userId: user.userId },
                            payload: req.body
                        });
                        res.json({
                            order
                        });
                    } catch (error:any) {
                        console.log({ error });
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/payment")
            .post(sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                    let error_message = 'Please try again! Payment failed';
                    try {
                        const user = await this.userRouter.getLoginUser(req, res);
                        const userForEdit:any = await this.userController.me(user.userId)
                        if(userForEdit === null){
                           return res.status(401).json({ error : "user not found"});
                        }
                        
                        // const paymentMethod = await stripe.paymentMethods.retrieve(
                        //     req.body.payment_id
                        // );
                        // console.log({paymentMethod});
                        await this.checkStripeCardValidation(req, res);
                        let amount = parseFloat(parseFloat(req.body.amount).toFixed(2)) * 100;
                        // const cardToken = await stripe.tokens.create({
                        //     card: {
                        //         number: req.body.card_number,
                        //         exp_month: req.body.card_expire_month,
                        //         exp_year: req.body.card_expire_year,
                        //         cvc: req.body.card_code,
                        //         address_state: req.body.payer_country,
                        //         address_zip: req.body.payer_zipCode,
                        //     },
                        // });    
                        // console.log(cardToken);                   
                        // // source: cardToken.id,
                        const charge = await stripe.charges.create({
                            amount: amount,
                            currency: "usd",
                            source: req.body.token_id,
                            receipt_email: req.body.payer_email,
                            description: `Stripe Charge Of Amount ${amount} for One Time Payment`,
                        });
                        if (charge.status === "succeeded") {
                            // res.status(200).send({ Success: charge });
                            const order = await this.orderController.edit(user.role, {
                                query: { id: req.body.order_id, userId: user.userId },
                                payload: {
                                    status: Status.checkout,
                                    paymentMethod: PaymentMethodStatus.CC,
                                    payerEmail: req.body.payer_email,
                                    token_id: req.body.token_id
                                }
                            });
                            
                            order.products.forEach((track)=>{
                            userForEdit.tracks.push({track: track.track_id,license: track.license_id})
                            })
                            const userEdited = await this.userController.edit(user.role, user.userId, {
                                query: { id: user.userId },
                                payload: userForEdit.tracks
                            });
                            res.json({
                                order
                            });}
                         else {
                            res.status(400).send(new BadRequestError(error_message, {
                                message: error_message
                            }));
                        }
                    } catch (error: any) {
                        let err = error ? error.raw ? error.raw.message ? error.raw.message : error_message : error_message : error_message;
                        res.status(error.status || error.statusCode || 400).send(new BadRequestError(err, {
                            message: err
                        }));
                    }
                }));
    }
}

export default new OrderRouter(orderController,userController, userRouter,);