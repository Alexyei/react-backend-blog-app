import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {postCreateValidation, postUpdateValidation} from "../validations/postValidations";
import requestValidationMiddleware from "../middlewares/requestValidationMiddleware";
import PostController from "../controllers/postController"
export default function postRoutes(router: Router) {

    // router.get('/tags', PostController.getLastTags);
    //
    router.get('/posts', PostController.getAll);
    router.get('/posts/tags', PostController.getLatestTags);
    router.get('/posts/:id', PostController.getOne);
    router.post('/posts', authMiddleware, postCreateValidation, requestValidationMiddleware, PostController.create);
    router.delete('/posts/:id',  authMiddleware, PostController.remove);
    router.patch(
        '/posts/:id',
        authMiddleware,
        postUpdateValidation,
        requestValidationMiddleware,
        PostController.update,
    );
}