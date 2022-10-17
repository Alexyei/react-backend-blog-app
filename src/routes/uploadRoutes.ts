import {NextFunction, Request, Response, Router} from "express";
import {loginValidation} from "../validations/authValidations";
import requestValidationMiddleware from "../middlewares/requestValidationMiddleware";
import UserController from "../controllers/userController";
import fileUploadMiddleware from "../middlewares/fileUploadMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

export default function uploadsRoutes(router: Router) {
    router.post('/upload/post/main',authMiddleware, fileUploadMiddleware("uploads/post/main/"),(result:any,req:Request,res:Response,next:NextFunction)=>{
        if (typeof result == "string"){
            return res.json({
                url: `/uploads/post/main/${result}`,
            });
        }
        next(result)
    });
}