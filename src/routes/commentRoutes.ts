import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";
import CommentController from "../controllers/commentController";

export default function commentsRoutes(router: Router) {
    router.post('/comments/seed', authMiddleware, CommentController.seedComments);

}