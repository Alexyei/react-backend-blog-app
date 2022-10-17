import {Router} from "express";
import {default as authRoutes} from "./authRoutes";
import uploadsRoutes from "./uploadRoutes";


const router = Router();

function createRouter() {
    authRoutes(router);
    uploadsRoutes(router);
}

createRouter();

export default router;