import { User } from "../user.model";

export class Pagination {
    constructor() { }

    public static async pagination(req, key) {
        var count = 5;
        if (key === 'U') {
            count = await User.countDocuments();
        } 
        const limit = parseInt(req.query.limit ? req.query.limit.toString() : count.toString()); // results per page
        const page = parseInt(req.query.page ? req.query.page.toString() : '1'); // Page
        const pageOptions = {
            page: page,
            limit: limit
        }
        return pageOptions;
    }

    // public static pagination(req) {
    // 	const limit = parseInt(req.query.limit ? req.query.limit.toString() : '5'); // results per page
    // 	const page = parseInt(req.query.page ? req.query.page.toString() : '1'); // Page
    // 	const pageOptions = {
    // 		page: page,
    // 		limit: limit
    // 	}
    // 	return pageOptions;
    // }
}