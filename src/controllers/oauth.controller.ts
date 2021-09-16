import { ForbiddenError } from "../errors";
import { CONFIG } from "../models/constants";
import { Language, Role } from "../models/enums";
import { User } from "../models/user.model";
import { createJwt } from "../shared";

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client([CONFIG.Android_Client_ID, CONFIG.IOS_Client_ID, CONFIG.Web_Client_ID]);

export class OAuthController {

    async verify(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [CONFIG.Android_Client_ID, CONFIG.IOS_Client_ID, CONFIG.Web_Client_ID],  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        return await ticket.getPayload();
    }


async createOAuthUser(langPref: Language, token: string) {
        // if (!langPref || LanguageValues.indexOf(langPref) === -1) {
        //     throw new BadRequestError(`Required query fields (langPref) OR Validate fields (langPref ${LanguageValues})`, {
        //         message: `Required query fields (langPref) OR Validate fields (langPref ${LanguageValues})`
        //     });
        // }
        const verifyPayload = await this.verify(token).catch(console.error);
        if (!verifyPayload) {
            throw new ForbiddenError("Token not verified", {
                message: 'Token not verified',
            });
        }
        // const userid = payload['sub'] | payload['hd'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        const name = verifyPayload.name.split(' ');
        const query = { $and: [{ 'deleted': false }, { email: verifyPayload.email }] };
        // const query = { $and: [{ 'langPref': langPref }, { 'deleted': false }, { email: verifyPayload.email }] };
        var user = await User.findOne(query);
        var access_token = '';
        if(user === null){
        const payload = {
            firstName: name[0],
            lastName: name[1],
            imageUrl: verifyPayload.picture,
            email: verifyPayload.email.toLocaleLowerCase(),
            role: Role.User,
            isVerified: true,
            langPref: langPref
        };
        const user = new User({
            ...payload
        });
        await user.save();
    }
    access_token =  createJwt({
        data: {
            role: Role.User,
            userId: user?._id,
        }
    });
    return {
        access_token,
        fullName: name,
        role: user?.role,
        userId: user?._id,
        langPref: user?.langPref,
    };
}
}
export default new OAuthController();
