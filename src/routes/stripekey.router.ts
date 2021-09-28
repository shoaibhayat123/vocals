import * as express from 'express';

// middleware
import { sanitizeBody, sanitizeQuery, authentication, authorization, staticAuthentication, trimQueryWhiteSpace, trimBodyWhiteSpace } from '../middleware'
// controllers
import stripeKeyController, { StripeKeyController } from '../controllers/stripekey.controller';
// model or interfaces
import { IAuthenticatedResponse, IAuthorizedResponse } from '../models/interfaces';

import { asyncWrap } from '../shared/async-wrap';
import { BadRequestError, InternalServerError, NotFoundError } from '../errors';
import { Role } from '../models/enums';
import { Pagination } from '../models/shared';
import { licenseTypes } from '../models/enums/licenseTypes';

export class StripeKeyRouter {
    public router: express.Router;
    constructor(
        private stripeKeyController: StripeKeyController,
    ) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }

    private async get(req, res) {
        try {
            const { search, type, sortKey } = req.query as any;
            const track = await this.stripeKeyController.get();
            if(track === null) { return res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            }))}
            res.json(track)
        } catch (error:any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }



    private async create(req, res) {
        try {
            const result = await this.stripeKeyController.create({ payload: req.body });
            res.json(result);
        } catch (error:any) {
            console.log({error});
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async edit(req, res) {
        try {
            var { search } = req.query as any;
            const result = await this.stripeKeyController.edit({  query: { id: search },payload: req.body });
            res.json(result);
        } catch (error:any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async delete(req, res) {
        try {
            const query = req.query as any;
            const result = await this.stripeKeyController.delete({ query: query });
            res.json(result);
        } catch (error:any) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private routes() {
        this.router.route("/get")
            .get(sanitizeQuery, trimQueryWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin, Role.User]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.get(req, res);
                }));

        this.router.route("/create")
            .post(sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin,Role.Admin]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.create(req, res);
                }));
        
        this.router.route("/edit")
            .patch(sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin,Role.Admin]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.edit(req, res);
                }));

        this.router.route("/delete")
            .get(sanitizeQuery, trimQueryWhiteSpace, sanitizeBody, trimBodyWhiteSpace, authentication, authorization([Role.SuperAdmin, Role.Admin]),
                asyncWrap<IAuthorizedResponse>(async (req, res) => {
                    await this.delete(req, res);
                }));
    }
}

export default new StripeKeyRouter(stripeKeyController,);