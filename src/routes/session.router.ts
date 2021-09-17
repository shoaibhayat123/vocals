import * as express from 'express';

// middleware
import { sanitizeBody, sanitizeQuery, authentication, authorization, staticAuthentication, trimQueryWhiteSpace, trimBodyWhiteSpace } from '../middleware'
// controllers
import sessionController, { SessionController } from '../controllers/session.controller';
// model or interfaces
import { IAuthenticatedResponse, IAuthorizedResponse } from '../models/interfaces';

import { asyncWrap } from '../shared/async-wrap';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../errors';
import { Role } from '../models/enums';
import { me } from '../shared';

export class SessionRouter {
    public router: express.Router;
    constructor(
        private sessionController: SessionController
    ) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }
    private routes() {
        this.router.route("")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization(),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    try {
                        const session = await this.sessionController.getAll();
                        if (session ?.length === 0) {
                            res.status(404).send(new NotFoundError(`Not found`, {
                                message: `Not found`,
                                i18n: 'notExist'
                            }));
                        } else {
                            res.json({
                                session
                            });
                        }
                    } catch (error: any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));

        this.router.route("/logout")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthenticatedResponse>(async (req, res) => {
                    try {
                        const decodedToken = await me(req, res) as any;
                        if (decodedToken === null) {
                            res.status(401).send(new UnauthorizedError(`Invalid Token`, {
                                message: `Invalid Token`,
                                i18n: 'invalidToken'
                            }));
                        }
                        const auth = req.headers['authorization'] || '';
                        const [, token] = auth.split(' ');
                        let userId = decodedToken.data.userId;
                        const ip = req.clientIp || '';
                        const session = await this.sessionController.logout({
                            query: { user_id: userId, token: token, ip: ip }
                        });
                        res.json({
                            session
                        });
                    } catch (error: any) {
                        res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
                    }
                }));
    }
}

export default new SessionRouter(sessionController);