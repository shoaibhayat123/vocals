import mongoose from 'mongoose';
import { CONFIG } from '../models/constants';

export class DBConnection {
    constructor() { }

    async connect() { // add async
        console.log('connecting to mongo');
        try {
            await mongoose.connect(CONFIG.MONGOOSEURI, { useNewUrlParser: true, useUnifiedTopology: true });
        } catch (error) {
            console.log('error during connecting to mongo: ');
            console.error(error);
        }
    }
}

export default new DBConnection();
