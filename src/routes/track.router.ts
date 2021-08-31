import * as express from 'express';

// middleware
import { sanitizeBody, sanitizeQuery, authentication, authorization, staticAuthentication, trimQueryWhiteSpace, trimBodyWhiteSpace } from '../middleware'
// controllers
import trackController, { TrackController } from '../controllers/track.controller';
import licenseController, { LicenseController } from '../controllers/license.controller';
// model or interfaces
import { IAuthenticatedResponse, IAuthorizedResponse } from '../models/interfaces';

import { asyncWrap } from '../shared/async-wrap';
import { BadRequestError, InternalServerError, NotFoundError } from '../errors';
import { Role } from '../models/enums';
import { Pagination } from '../models/shared';
import { query } from 'express';
import { CreateOrUpdateTrackParams } from '../controllers/track.controller';
import { ITrack } from '../models/Track.model';

export class TrackRouter {
    public router: express.Router;
    constructor(
        private trackController: TrackController,
        private licenseController : LicenseController
    ) {
        this.router = express.Router();
        this.middleware();
        this.routes();
    }
    private middleware() { }

    private async get(req, res) {
        try {
            const { search, type, sortKey } = req.query as any;
            const track = await this.trackController.get(search, type,sortKey, await Pagination.pagination(req, 'CT'));
            track === null ? res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            })) : res.json(track);
        } catch (error) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async getBy(req, res) {
        try {
            const { search } = req.query as any;
            const track:any = await this.trackController.getBy(search);
            if(track === null) { return res.status(404).send(new NotFoundError(`No record found`, {
                message: `No record found`, i18n: 'notExist'
            }))}
            const license = await this.licenseController._findLicense(res.locals.license_id)
            if (license === null) {
                track.forEach((e)=>[
                    e.wavUrl = undefined,
                    e.stemUrl = undefined,
                    e.taggedMp3Url = undefined,
                ])
                const tracks =<ITrack>track
                return res.status(200).json({
                    tracks
                })

            }
            res.json(track);
        } catch (error) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async create(req, res) {
        try {
            const result = await this.trackController.create({ payload: req.body });
            res.json(result);
        } catch (error) {
            console.log({error});
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async edit(req, res) {
        try {
            var { search } = req.query as any;
            const track = await this.trackController._findTrack(search)
            if (track === null) {
                return res.status(400).send(new BadRequestError("Track not found"));

            }
            if (track.belongsTo != res.locals.user.userId || res.locals.user.role == "super admin") {
                return res.status(400).send(new BadRequestError("You do not have permission to edit"))
            }
            const result = await this.trackController.edit({  query: { id: search },payload: req.body });
            res.json(result);
        } catch (error) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
    }

    private async delete(req, res) {
        try {
            const query = req.query as any;
            const track = await this.trackController._findTrack(query)
            if (track === null) {
                return res.status(400).send(new BadRequestError("Track not found"));

            }
            if (track.belongsTo != res.locals.user.userId || res.locals.user.role == "super admin") {
                return res.status(400).send(new BadRequestError("You do not have permission to edit"))
            }
            const result = await this.trackController.delete({ query: query });
            res.json(result);
        } catch (error) {
            res.status(error.status || 500).send(!error.status ? new InternalServerError("Something wrong") : error);
        }
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

export default new TrackRouter(trackController,licenseController);