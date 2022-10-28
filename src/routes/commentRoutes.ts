import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";
import CommentController from "../controllers/commentController";
import {commentCreateValidation} from "../validations/commentsValidations";

export default function commentsRoutes(router: Router) {
    router.post('/comments/seed', authMiddleware, CommentController.seedComments);
    router.post('/comments',authMiddleware,commentCreateValidation,CommentController.createComment)
    router.get('/comments/:postID',CommentController.getPostComments)
}