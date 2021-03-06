import * as express from 'express';

// middleware
import { sanitizeBody, sanitizeQuery, authentication, authorization, staticAuthentication, trimQueryWhiteSpace, trimBodyWhiteSpace } from '../middleware'
// controllers
import userController, { UserController } from '../controllers/user.controller';
import emailController, { EmailController } from '../controllers/email.controller';
import oAuthController,{ OAuthController } from '../controllers/oauth.controller';
// model or interfaces
import { IAuthenticatedResponse, IAuthorizedResponse } from '../models/interfaces';

import { Language, Role } from '../models/enums';
import { asyncWrap } from '../shared/async-wrap';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../errors';
import { me } from '../shared';
import { User } from '../models/user.model';
import { Pagination } from '../models/shared';
import { TEMPLATES } from '../models/constants';
import serviceController, { ServiceController } from '../controllers/service.controller';
import trackController,{ TrackController } from '../controllers/track.controller';
import orderController, { OrderController } from '../controllers/order.controller';


export class UserRouter {
    public router: express.Router;
    constructor(
        private userController: UserController,
        private emailController: EmailController,
        private oAuthController: OAuthController,
        private serviceController: ServiceController,
        private trackController: TrackController,
        private orderController: OrderController,

    ) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }

    public async getLoginUser(req, res) {
        const decodedToken = await me(req, res) as any;
        if (decodedToken === null) {
            res.status(401).send(new UnauthorizedError(`Invalid Token`, {
                message: `Invalid Token`,
                i18n: 'invalidToken'
            }));
        }
        return decodedToken.data;
    }

    private async dashboard(req, res) {
        try {
            let users = await this.userController.getCountOfUsers();
            if(users === null){ users = [0]}
            let services = await this.serviceController.getCountOfServices();
            if(services === null) {services = [0]}
            let tracks = await this.trackController.getCountOfTracks();
            if(tracks === null){ tracks = [0]}
            let orders:any = await this.orderController.getCountOfTracksDownloaded();
            if(orders.length === 0){ orders = [{"totalTracksDownloaded":0,"totalAmountSpent":0,"totalServicesPurchased":0}]}
            const data = {users,services,tracks,orders}
            res.json(data)
        } catch (error:any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }


    private async get(req, res) {
        try {
            const user = await this.getLoginUser(req, res);
            const { search, role, type, sortKey } = req.query as any;
            const users = await this.userController.get(user, role, search, type, sortKey, await Pagination.pagination(req, 'U'));
            users === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(users);
        } catch (error:any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async getBy(req, res) {
        try {
            const tokenUser = await this.getLoginUser(req, res);
            const { search, role } = req.query as any;
            const user = await this.userController.getBy(tokenUser, role, search);
            user === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(user);
        } catch (error:any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private routes() {
        this.router.route("/get")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.get(req, res);
                }));

        this.router.route("/get-by")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.getBy(req, res);
                }));

        this.router.route("/dashboard")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin,Role.Admin]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                   await this.dashboard(req, res)
                }));

        this.router.route("/create")
            .post(sanitizeBody, trimBodyWhiteSpace, authentication, authorization(),
                asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                    try {
                        const user = await this.userController.create({
                            payload: req.body
                        }, 'API');
                        // await this.userController.notifyNewUser(user.email);
                        res.json({
                            user
                        });
                    } catch (error:any) {
                        console.log({ error });
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }))
        this.router.route("/create/google")
        .post(sanitizeBody, trimBodyWhiteSpace, authentication, authorization(),
            asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                try {
                    const user = await this.oAuthController.createOAuthUser(req.body.langPref,req.body.token);
                    res.json({
                        user
                    });
                } catch (error:any) {
                    console.log({ error });
                    res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                }
            }))

        this.router.route("/me")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    try {
                        const { userId } = await this.getLoginUser(req, res);
                        const users = await this.userController.me(userId);
                        if (users === null) {
                            res.status(404).send(new NotFoundError(`Not found`, {
                                message: `Not found`,
                                i18n: 'notExist'
                            }));
                        } else {
                            res.json({
                                users
                            });
                        }
                    } catch (error:any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/profile")
            .patch(sanitizeQuery, trimQueryWhiteSpace, sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    try {
                        const token = await this.getLoginUser(req, res);
                        const user = await this.userController.edit(token.role, token.userId, {
                            query: { id: token.userId },
                            payload: req.body
                        });
                        // await this.userController.notifyNewUser(user.email);
                        res.json({
                            user
                        });
                    } catch (error:any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/edit")
            .patch(sanitizeQuery, 
                trimQueryWhiteSpace, 
                sanitizeBody, 
                trimBodyWhiteSpace, 
                authentication, 
                authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    try {
                        var { search } = req.query as any;
                        const token = await this.getLoginUser(req, res);
                        if (token !== null && (token.role === Role.SuperAdmin || token.role === Role.Admin || token.role === Role.User)) {
                            search = token.userId;
                        }
                        const user = await this.userController.edit(token.role, token.userId, {
                            query: { id: search },
                            payload: req.body
                        });
                        // await this.userController.notifyNewUser(user.email);
                        res.json({
                            user
                        });
                    } catch (error:any) {
                        console.log({ error });
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/login")
            .post(sanitizeBody, trimBodyWhiteSpace, staticAuthentication,
                asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                    try {
                        const { email, password } = req.body;
                        const search = email;
                        const user = await this.userController.login({ search, password });
                        res.json({
                            user
                        });
                    } catch (error:any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/password/reset")
            .post(sanitizeBody, trimBodyWhiteSpace, staticAuthentication,
                asyncWrap(async (req, res) => {
                    try {
                        const { email } = req.body;
                        const user = await User.findOne({ email });
                        if (user === null) {
                            if (user === null) {
                                return res.status(401).send(new NotFoundError("User not found", {
                                    message: 'User not found'
                                }));
                            }
                        }
                        const resetToken = await user.createPasswordResetToken();
                        // const message = "Need to reset your password? No problem! just click the button below and you'll be on your way. If you did not make this request. please ignore this mail";
                        const message = "Need to reset your password? No problem! just use reset password token into your reset password screen with new password";
                        const language = 'en';
                        const heading = TEMPLATES[language]['resetPassword']['subject'];
                        const payload = { heading: heading, title: heading, message: message }
                        const subject = heading;
                        const filename = "reset.html";
                        await this.emailController.send(subject, payload, user.email, '', filename, resetToken);
                        // await this.emailController.sendUserResetPasswordEmail({ user, resetToken });
                        res.json({ result: "Sent" });
                    } catch (error:any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/password/set")
            .post(sanitizeQuery, trimQueryWhiteSpace, sanitizeBody, trimBodyWhiteSpace, staticAuthentication,
                asyncWrap(async (req, res) => {
                    try {
                        const { resetToken } = req.query;
                        const { password } = req.body;
                        const user = await this.userController.verifyUserResetToken(!resetToken ? '' : resetToken);
                        if (user === null) {
                            return res.status(401).send(new UnauthorizedError("Invalid Token", {
                                message: 'Invalid Token'
                            }));
                        }
                        await user.setPassword(password);
                        res.json({ result: "Reset succesfully" });
                    } catch (error:any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));
                this.router.route("/subscription")
                .get(sanitizeBody, trimBodyWhiteSpace, staticAuthentication,
                    asyncWrap(async (req, res) => {
                        try {
                            const { email,superadmin } = req.query as any;
                            const role = "super admin"
                            // const user = await User.findOne([{ 'role': role }]);
                            // if (user === null) {
                            //     throw new NotFoundError(`Super Admin not found`, {
                            //         message: `Super Admin not found`,
                            //     });
                            // }
                            const language = 'en';
                            const message = `This user ${email} has subscribed for the newsletter`;
                            const heading = TEMPLATES[language]['subscription']['subject'];
                            const payload = { heading: heading, title: heading, message: message }
                            const subject = heading;
                            const filename = "contact.html";
                            await this.emailController.send(subject, payload, superadmin, '', filename, '');
                            
                            return res.json('Email sent successfully') 
                        } catch (error:any) {
                            res.json(error.message);
                           //return res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                        }
                    }));
                    this.router.route("/contact")
                    .get(sanitizeBody, trimBodyWhiteSpace, staticAuthentication,
                        asyncWrap(async (req, res) => {
                            try {
                                const { email,superadmin,message } = req.query as any;
                                const user = await User.findOne({ "email": email }).select("langPref role _id user_id fullName userName phone_1 phone_2 email description gender dob age imageUrl "
                                 + "city state country address isAcceptedTerm code approvedAt approvedBy deleted deactivated createdAt updatedAt billingFullName billingAdress billingCity billingCountry billingZipCode");
                                if (user === null) {
                                    throw new NotFoundError(`User not found`, {
                                        message: `User not found`,
                                    });
                                }
                                // message.name = user.userName
                                const language = 'en';
                                const heading = TEMPLATES[language]['contactInfo']['subject'];
                                const payload = { heading: heading, title: heading, message: message }
                                const subject = heading;
                                const filename = "contact.html";
                                await this.emailController.send(subject, payload, superadmin, '', filename, '');
                                
                                return res.json('Email sent successfully') 
                            } catch (error:any) {
                                res.json(error.message);
                               //return res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                            }
                        }));
    }
}

export default new UserRouter(userController, emailController,oAuthController, serviceController,trackController,orderController);