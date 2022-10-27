import {Router} from "express";
import {default as authRoutes} from "./authRoutes";
import uploadsRoutes from "./uploadRoutes";
import postRoutes from "./postRoutes";
import commentsRoutes from "./commentRoutes";


const router = Router();

function createRouter() {
    authRoutes(router);
    uploadsRoutes(router);
    postRoutes(router);
    commentsRoutes(router);
}

createRouter();

export default router;