import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
// import { logger } from './shared/winston-logger';
const PORT = process.env.PORT || 3005;

import http from 'http'

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server Listing Port ${PORT}`);
});
export const basePath = __dirname;