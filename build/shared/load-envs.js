"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvs = void 0;
function loadEnvs(envs, throw_error) {
    if (throw_error === void 0) { throw_error = true; }
    var environment = {};
    var missing_envs = [];
    for (var _i = 0, envs_1 = envs; _i < envs_1.length; _i++) {
        var env = envs_1[_i];
        if (process.env[env] !== undefined) {
            environment[env] = process.env[env];
        }
        else {
            missing_envs.push(env);
        }
    }
    if (missing_envs.length > 0) {
        var message = "Failed to load environment variables: " + missing_envs.join(",");
        if (throw_error) {
            console.info("ERROR: " + message);
            throw new Error(message);
        }
        else
            console.info("WARNING: " + message);
    }
    return environment;
}
exports.loadEnvs = loadEnvs;
