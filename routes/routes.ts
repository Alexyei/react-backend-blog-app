import {Router} from "express";
import {default as authRoutes} from "./authRoutes";


const router = Router();

function createRouter() {
    authRoutes(router);

}

createRouter();

export default router;