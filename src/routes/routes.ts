import {Router} from "express";
import {default as authRoutes} from "./authRoutes";
import uploadsRoutes from "./uploadRoutes";
import postRoutes from "./postRoutes";


const router = Router();

function createRouter() {
    authRoutes(router);
    uploadsRoutes(router);
    postRoutes(router)
}

createRouter();

export default router;