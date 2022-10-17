import {NextFunction, Request, Response} from "express";
import userService from "../services/userService";
import jwtService from "../services/jwtService";


class UserController {
    async registration(req: Request, res:Response, next: NextFunction) {
        try {

            const {email, login, password, avatarUrl } = req.body;
            const userData = await userService.registration(email, login, password,avatarUrl);

            const token = await jwtService.sign({_id:userData.id})
            return res.json({...userData, token});
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res:Response, next: NextFunction) {
        try {

            const {email, password}  = req.body;
            const userData = await userService.login(email, password);

            const token = await jwtService.sign({_id:userData.id})
            return res.json({...userData, token});
        } catch (e) {
            next(e);
        }
    }

    async getMyData(req: Request, res:Response, next: NextFunction){
        try {
            const userData = await userService.getUserData( req.userID);

            const token = await jwtService.sign({_id:userData.id})
            return res.json({...userData, token});
        } catch (e) {
            next(e);
        }
    }

    // async logout(req: Request, res:Response, next: NextFunction) {
    //     try {
    //
    //         sessionService.remove(req,true, (err)=>{
    //             // res.redirect(config.app.client_url) // will always fire after session is destroyed
    //             res.json();
    //         })
    //
    //         // req.session.destroy((err) => {
    //         //     res.redirect(config.app.client_url) // will always fire after session is destroyed
    //         // })
    //     } catch (e) {
    //         next(e);
    //     }
    // }
    //
    // async clearSession(req: Request, res:Response, next: NextFunction) {
    //     try {
    //
    //         sessionService.clear(req.session.userID)
    //         // req.session.destroy((err) => {
    //         //     res.redirect(config.app.client_url) // will always fire after session is destroyed
    //         // })
    //         res.json("Вы вышли со всех устройств!")
    //     } catch (e) {
    //         next(e);
    //     }
    // }


}

export default new UserController();