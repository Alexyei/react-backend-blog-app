import {NextFunction, Request, Response} from "express";
import commentService from "../services/commentService";


class CommentController {
    async seedComments(req: Request, res: Response, next: NextFunction) {
        try {
            await commentService.seedComments()
            return res.json("seeded success!");
        } catch (e) {
            next(e);
        }
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        try {

            return res.json("new comment");
        } catch (e) {
            next(e);
        }
    }

    async getPostComments(req: Request, res: Response, next: NextFunction) {
        try {
            const postID = req.params.id;
            return res.json("get comments");
        } catch (e) {
            next(e);
        }
    }
}

export default new CommentController()