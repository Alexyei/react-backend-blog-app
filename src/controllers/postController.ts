import {NextFunction, Request, Response} from "express";
import PostModel from "../models/postModel";
import postService from "../services/postService";
import {IPostCreateProps} from "../dao/postDAO";
class PostController {
    async getLatestTags(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await postService.getLatestTags())
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(await postService.getAll())
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {

            const postId = req.params.id;

            return res.json(await postService.getOne(postId));

        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {

            const props:IPostCreateProps = {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                userID: req.userID,
            }

            const newPost = await postService.create(props)
            const newUrl = await postService.saveMainImage(req.userID,newPost.id,newPost.imageUrl);
            newPost.imageUrl = newUrl;

            return res.json(newPost);
        } catch (error) {
            next(error);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(await postService.delete(req.params.id,req.userID))
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }
}

export default new PostController()