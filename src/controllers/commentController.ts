import {NextFunction, Request, Response} from "express";
import commentService from "../services/commentService";
import {IPostCreateProps} from "../dao/postDAO";
import {ICommentCreateProps} from "../dao/commentDAO";


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
            const props:ICommentCreateProps = {
                owner: req.body.owner,
                text: req.body.text,
                parent: req.body.parent,
                author: req.userID
            }


            return res.json(await commentService.createComment(props));
        } catch (e) {
            next(e);
        }
    }

    async getPostComments(req: Request, res: Response, next: NextFunction) {
        try {
            const postID = req.params.postID;
            return res.json(await commentService.getPostComments(postID));
        } catch (e) {
            next(e);
        }
    }
}

export default new CommentController()