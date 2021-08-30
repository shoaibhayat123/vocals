import * as path from 'path';
import fs from 'fs';
import { CONFIG } from '../models/constants';
import { randomString } from '../shared';
import { BadRequestError } from "../errors";
import { FileType, FileTypeValues } from '../models/enums';

export class UploadController {
    constructor() {
    }

    async upload(selectedFile: any, type: FileType) {
        const index = FileTypeValues.indexOf(type);
        if (index === -1) {
            throw new BadRequestError(`Invalid type, should be in ${FileTypeValues}`, {
                message: `Invalid type, should be in ${FileTypeValues}`
            });
        }
        const ext = path.extname(selectedFile.name);
        var extensions = CONFIG.imageExtensions;
        var dir = CONFIG.IMAGEDIR;
        if (type === FileType.video) {
            extensions = CONFIG.videoExtensions;
            dir = CONFIG.VIDEODIR;
        } else if (type === FileType.untaggedAudio) {
            extensions = CONFIG.audioExtensions;
            dir = CONFIG.UNTAGAUDIODIR;
        }else if (type === FileType.taggedAudio) {
            extensions = CONFIG.audioExtensions;
            dir = CONFIG.TAGAUDIODIR;
        } else if (type === FileType.file) {
            extensions = CONFIG.fileExtensions;
            dir = CONFIG.FILEDIR;
        }
        if (extensions.indexOf(ext.toLowerCase()) === -1) {
            throw new BadRequestError(`Invalid type, should be ${extensions}`, {
                message: `Invalid type, should be ${extensions}`
            });
        }
        const f_name = `${Date.now()}_${randomString(8)}`;
        const file_name = `${f_name}${ext}`;
        if (!fs.existsSync(`./${dir}`)) {
            fs.mkdirSync(`./${dir}`);
        }
        const uploaded = await selectedFile.mv(`./${dir}/${file_name}`);
        const url = `${CONFIG.IMAGEBASEURL}${CONFIG.IMAGEURLNAME}/${file_name}`;
        const thumbUrl = `${CONFIG.IMAGEBASEURL}${CONFIG.IMAGEURLNAME}/${f_name}.jpg`;
        // if (type === FileType.video) {
        //     try {
        //         await genThumbnail(url, `./${dir}/${f_name}.jpg`, '40%', {
        //             path: ffmpeg.path
        //         });
        //         console.log('Done!');
        //         return `${thumbUrl},${url}`;
        //     } catch (err) {
        //         console.log('thumbfile err', err)
        //         throw new BadRequestError(`Thumb file not created`, {
        //             message: `Thumb file not created`
        //         });
        //     }
        // } else {
        return url;
        // }
    }
}

export default new UploadController();
