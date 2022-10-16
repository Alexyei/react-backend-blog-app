import {Router} from "express";
import {NextFunction, Request, Response} from "express";
import {loginValidation, registerValidation} from "../validations/authValidations";
import requestValidationMiddleware from "../middlewares/requestValidationMiddleware";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
export default function publicRoomsRoutes(router: Router) {

    // router.post('/public-rooms/create',
    //    // authMiddleware,
    //     body('password').isLength({max: 32}).withMessage("Некорректная длина пароля"),
    //     body('name').isLength({min: 5, max: 32}).withMessage("Некорректная длина названия").custom(value => {
    //         return getPublicRoomByName(value).then(room => {
    //             if (room !== null) {
    //                 return Promise.reject('Такое название группы уже используется');
    //             }
    //         });
    //     }),
    //     publicRoomController.create);
    // router.get('/',
    //     async (req: Request, res:Response, next: NextFunction)=>{
    //     return res.send("Hello api 2!")}
    // )

    router.post('/auth/login', loginValidation, requestValidationMiddleware, UserController.login);
    router.post('/auth/register', registerValidation, requestValidationMiddleware, UserController.registration);
    router.get('/auth/me', authMiddleware, UserController.getMyData);
}