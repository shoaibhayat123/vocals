import { loadEnvs } from '../../shared';
import { EnvironmentName, EnvironmentNameValues } from '../enums/environment-name';
/* loadEnvs takes an array of environment variables and loads them into an object.
*  By Default, it will throw an error if any of them are missing.
*  You can disable the error by passing false as the second argument.
*  In this case, it will log a warning for each missing environment variables.
*  This way, you can easily see which variables you can set in the logs.
*/

const getEnvironmentName = (NAME: string) => {
    switch (NAME) {
        case EnvironmentName.Production: return EnvironmentName.Production;
        case EnvironmentName.Stage: return EnvironmentName.Stage;
        case EnvironmentName.Test: return EnvironmentName.Test;
        case EnvironmentName.Local: return EnvironmentName.Local;
        default:
            throw new Error('Invalid Environment Name given. Must be one of: ' + EnvironmentNameValues);
    }
};

const configEnvs = loadEnvs([
    'BCRYPT_SALT_ROUNDS',
    'BCRYPT_REHASH_DATE'
], false);

let BCRYPT_REHASH_DATE;
try {
    if (BCRYPT_REHASH_DATE) BCRYPT_REHASH_DATE = new Date(configEnvs['BCRYPT_REHASH_DATE']);
} catch (e) {
    // logger.error(`BCRYPT_REHASH_DATE not a valid date: ${BCRYPT_REHASH_DATE}`);
}

export const CONFIG = {
    MONGOOSEURI: 'mongodb://localhost:27017/vocals_db',	// local server
    // SERVER_ALERT_CONTACTS: serverAlertContacts,
    // SFTP_ALERT_CONTACTS: sftpAlertContacts,	
    
    // IMAGEBASEURL: 'http://localhost:3002',  // local
    // IMAGEURLNAME: '/static',
    STATIC_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJ1c2VyIiwidXNlcklkIjoiNWY1Yjk0YTY2YTNjYTMwMDA0YzJjZWJiIn0sImlhdCI6MTU5OTgzOTMwMiwiZXhwIjoxNjAwMDk4NTAyfQ.Fdft4zwZwOzww6Fdbk2t4UiTz1cpNSrIYrzsvddXh1U',
    mutliGETRouteModules: ['category', 'package', 'product', 'plan'],
    mutliPOSTRouteModules: ['user', 'contact', 'subscribe'],
    BCRYPT_SALT_ROUNDS:10, //+configEnvs['BCRYPT_SALT_ROUNDS'] || 10,
    BCRYPT_REHASH_DATE: BCRYPT_REHASH_DATE || new Date("2019-11-26"),
    APPLICATION_EXPIRY_DAYS: 14,
    ROOT_FILE: "server",
    MAIL: {
        HOST: 'smtp.gmail.com',
        PORT: 465,
        SERVICE: 'gmail',
        DOMAIN: 'gmail.com',
        EMAIL_FROM: 'developers@appverticals.com',
        CLIENT_ID: '',
        CLIENT_SECRET: '',
        REFRESH_TOEKN: ''
    },
    ENVIRONMENT_CONFIG: loadEnvironmentConfig(EnvironmentName.Test || EnvironmentName.Local),
    ENVIRONMENT_NAME: getEnvironmentName(EnvironmentName.Test || EnvironmentName.Local)
};

function loadEnvironmentConfig(NAME: string): {
    ADMIN_URL: string, // admin-client
    CLIENT_URL: string, // client
} {
    switch (NAME) {
        case EnvironmentName.Production:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case EnvironmentName.Stage:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case EnvironmentName.Test:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case EnvironmentName.Local:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        default:
            throw new Error('Invalid Environment Name given. Must be one of: ' + EnvironmentNameValues);
    }
}