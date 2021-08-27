"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
var shared_1 = require("../../shared");
var environment_name_1 = require("../enums/environment-name");
/* loadEnvs takes an array of environment variables and loads them into an object.
*  By Default, it will throw an error if any of them are missing.
*  You can disable the error by passing false as the second argument.
*  In this case, it will log a warning for each missing environment variables.
*  This way, you can easily see which variables you can set in the logs.
*/
var getEnvironmentName = function (NAME) {
    switch (NAME) {
        case environment_name_1.EnvironmentName.Production: return environment_name_1.EnvironmentName.Production;
        case environment_name_1.EnvironmentName.Stage: return environment_name_1.EnvironmentName.Stage;
        case environment_name_1.EnvironmentName.Test: return environment_name_1.EnvironmentName.Test;
        case environment_name_1.EnvironmentName.Local: return environment_name_1.EnvironmentName.Local;
        default:
            throw new Error('Invalid Environment Name given. Must be one of: ' + environment_name_1.EnvironmentNameValues);
    }
};
var configEnvs = shared_1.loadEnvs([
    'BCRYPT_SALT_ROUNDS',
    'BCRYPT_REHASH_DATE'
], false);
var BCRYPT_REHASH_DATE;
try {
    if (BCRYPT_REHASH_DATE)
        BCRYPT_REHASH_DATE = new Date(configEnvs['BCRYPT_REHASH_DATE']);
}
catch (e) {
    // logger.error(`BCRYPT_REHASH_DATE not a valid date: ${BCRYPT_REHASH_DATE}`);
}
exports.CONFIG = {
    MONGOOSEURI: 'mongodb://localhost:27017/vocals_db',
    // SERVER_ALERT_CONTACTS: serverAlertContacts,
    // SFTP_ALERT_CONTACTS: sftpAlertContacts,	
    // IMAGEBASEURL: 'http://localhost:3005',  // local
    // IMAGEURLNAME: '/static',
    STATIC_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJ1c2VyIiwidXNlcklkIjoiNWY1Yjk0YTY2YTNjYTMwMDA0YzJjZWJiIn0sImlhdCI6MTU5OTgzOTMwMiwiZXhwIjoxNjAwMDk4NTAyfQ.Fdft4zwZwOzww6Fdbk2t4UiTz1cpNSrIYrzsvddXh1U',
    mutliGETRouteModules: ['category', 'package', 'product', 'plan'],
    mutliPOSTRouteModules: ['user', 'contact', 'subscribe'],
    BCRYPT_SALT_ROUNDS: 10,
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
    ENVIRONMENT_CONFIG: loadEnvironmentConfig(environment_name_1.EnvironmentName.Test || environment_name_1.EnvironmentName.Local),
    ENVIRONMENT_NAME: getEnvironmentName(environment_name_1.EnvironmentName.Test || environment_name_1.EnvironmentName.Local)
};
function loadEnvironmentConfig(NAME) {
    switch (NAME) {
        case environment_name_1.EnvironmentName.Production:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case environment_name_1.EnvironmentName.Stage:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case environment_name_1.EnvironmentName.Test:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case environment_name_1.EnvironmentName.Local:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        default:
            throw new Error('Invalid Environment Name given. Must be one of: ' + environment_name_1.EnvironmentNameValues);
    }
}
