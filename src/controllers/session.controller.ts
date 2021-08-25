import { Session, ISession } from '../models/session.model';
import { BadRequestError } from "../errors";
import { User } from '../models/user.model';

interface QueryParams {
    query: {
        user_id: string,
        token: string,
        ip: string
    }
}

export class SessionController {
    constructor() { }

    async getAll(): Promise<ISession[] | null> {
        return Session.find();
    }

    async logout({ query }: QueryParams) {
        if (!query.ip) {
            throw new BadRequestError("Required ip", {
                message: 'Required ip',
                i18n: 'isRequired'
            });
        }
        const user = await User.findById({ '_id': query.user_id });
        if (user === null) {
            throw new BadRequestError(`Logined user not found!`, {
                message: `Logined user not found!`
            });
        }
        const session = new Session({
            user_id: query.user_id,
            token: query.token,
            ip: query.ip,
            isLogout: true
        });
        await session.save();
        return session;
    }
}

export default new SessionController();