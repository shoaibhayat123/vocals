import express from 'express';
import body_parser from 'body-parser';
import httpContext from 'express-http-context';
import cors from 'cors';
import requestIp from 'request-ip';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

// Routes
import UserRouter from './routes/user.router';
import ContactRouter from './routes/contact.router';
import SessionRouter from './routes/session.router';
import faqRouter from './routes/faq.router';
import dbConnection, { DBConnection } from './config/database';
import UploadRouter from './routes/upload.router';
import TrackRouter from './routes/track.router';
import { CONFIG } from './models/constants';

// const logger = createLogger('app.ts');

// _ is used as a variable name to ignore the fact that it's not read

// import loadEnvs from './shared/load-envs';
// const envs = loadEnvs([''], false);
let version: string;
try {
    version = require('../package.json').version;
} catch (e) {
    console.error("Failed to load Version from package.json", e);
}

export class App {

    public app: express.Application;
    constructor(private dbConnection: DBConnection) {
        this.app = express();
        dbConnection.connect();
        this.app.set('trust proxy', 1); // needed for rate limiter
        this.middleware();
        this.routes();
        this.createFolder();
    }

    private createFolder(): void {
        // Create folder for uploading files.
        if (require.main) {
            const filesDir = path.join(path.dirname(require.main.filename), "uploads");
            if (!fs.existsSync(filesDir)) {
                fs.mkdirSync(filesDir);
            }
        }
    }

    private middleware(): void {
        this.app.use(body_parser.json());
        this.app.use(cors());
        this.app.use(httpContext.middleware);
        this.app.use(requestIp.mw());
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.IMAGEDIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.VIDEODIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.FILEDIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.UNTAGAUDIODIR));
        this.app.use(CONFIG.IMAGEURLNAME, express.static(CONFIG.TAGAUDIODIR));
        
        // default options
        this.app.use(fileUpload({
            // useTempFiles: true,
            // tempFileDir : path.basename('/profile-image'),
            mimetype: "image/jpeg"
        }));
        this.app.use((error: any, req: any, res: any, next: any) => {
            console.error('error.stack', error.stack);
            res.status(500).send('Something Broke!');
        });
        this.app.use((error: any, req: any, res: any, next: any) => {
            res.status(error.status || 500).send({
                error: {
                    status: error.status || 500,
                    message: error.message || 'Something Broke!',
                },
            });
        });
    }

    private routes(): void {
        this.app.use('/v1/user', UserRouter.router);
        this.app.use('/v1/session', SessionRouter.router);   
        this.app.use('/v1/contact', ContactRouter.router);
        this.app.use('/v1/faq', faqRouter.router);
        this.app.use('/v1/upload', UploadRouter.router);
        this.app.use('/v1/track', TrackRouter.router);

    }
}

export default new App(dbConnection).app;
