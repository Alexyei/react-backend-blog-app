import {NextFunction, Request, Response, Router} from "express";
import fileUploadMiddleware from "../middlewares/fileUploadMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import fs, {readdirSync, rmSync} from 'fs'
import path from "path";
import ApiError from "../exceptions/ApiError";
import {findPostByIDAndUser} from "../dao/postDAO";

export default function uploadsRoutes(router: Router) {
    router.post('/upload/post/main', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        //await fs.readdir(path.join(process.cwd(),`uploads/temp/${req.userID}/post/main/`)).then((f) => Promise.all(f.map(e => fs.unlink(e))))
        const dir = path.join(process.cwd(), `uploads/temp/${req.userID}/post/main/new/`)
        if(fs.existsSync(dir))
        readdirSync(dir).forEach(f => rmSync(`${dir}/${f}`));
        next()
    }, fileUploadMiddleware((req) => `uploads/temp/${req.userID}/post/main/new/`), async (result: any, req: Request, res: Response, next: NextFunction) => {
        if (typeof result == "string") {
            return res.json({
                // url: `/uploads/post/main/${req.file!.filename}`,
                url: `uploads/temp/${req.userID}/post/main/new/${result}`,
            });
        }
        next(result)
    });

    router.post('/upload/post/main/:postID', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        //await fs.readdir(path.join(process.cwd(),`uploads/temp/${req.userID}/post/main/`)).then((f) => Promise.all(f.map(e => fs.unlink(e))))
        const dir = path.join(process.cwd(), `uploads/temp/${req.userID}/post/main/${req.params.postID}/`)
        if(fs.existsSync(dir))
        readdirSync(dir).forEach(f => rmSync(`${dir}/${f}`));


       findPostByIDAndUser(req.params.postID, req.userID).then(user => {
            if (user == null) {
                next(ApiError.BadRequest("Неверный id пользователя или поста", []))
            }
            next()
        }).catch(e => {

           next(ApiError.BadRequest("Непредвиденная ошибка", []))
        });
    }, fileUploadMiddleware((req) => `uploads/temp/${req.userID}/post/main/${req.params.postID}/`), async (result: any, req: Request, res: Response, next: NextFunction) => {
        if (typeof result == "string") {
            return res.json({
                // url: `/uploads/post/main/${req.file!.filename}`,
                url: `uploads/temp/${req.userID}/post/main/${req.params.postID}/${result}`,
            });
        }
        next(result)
    });

    // router.post('/upload/post/main',authMiddleware,uploadController.addMainImage);
}