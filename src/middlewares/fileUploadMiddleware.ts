import {NextFunction, Request, Response} from "express";
import multer, {Multer} from "multer";
import config from "../configs/default";
import ApiError from "../exceptions/ApiError";
import fs from "fs";
import * as path from "path";


// function checkFileType(file: Express.Multer.File, cb:any){
//     function getExtension(filename:string) {
//         return filename.split('.').pop() || "";
//     }
//
//     // Allowed ext
//     // const filetypes = /jpeg|jpg|png|gif/;
//     const filetypes = /jpeg|jpg|png|gif/;
//     // Check ext
//     const extname = filetypes.test(getExtension(file.originalname).toLowerCase());
//     // Check mime
//     const mimetype = filetypes.test(file.mimetype);
//
//     if(mimetype && extname){
//         return cb(null,true);
//     } else {
//         // cb(new multer.MulterError())
//         cb(new Error('Доступны только следуюшие типы файлов: '+filetypes.source));
//     }
// }




export default function (dest:((req:Request)=>string)|string = "uploads/", types:string[]=["image/jpeg","image/jpg","image/png","image/gif"]){
    function getFileExtension(filename:string){
        const ext = filename.split(".").pop()

        return ext ? "."+ext: "";
    }

    const fileFilter: multer.Options['fileFilter'] = (req,file,cb)=>{
        if (types.includes(file.mimetype)){
            cb(null, true)
        }else{
            cb(new Error('Доступны только следуюшие типы файлов: '+types.join("; ")));
        }
    }



    return function (req: Request, res:Response, next: NextFunction) {
        function getDest(){
            if (typeof dest === "string") {
                return dest;
            }
            else return dest(req)
        }

        const destination = getDest()

        let newFilename = ""
        const storage = multer.diskStorage({
            destination: (_, __, cb) => {
                if (!fs.existsSync(path.join(process.cwd(),destination))) {
                    fs.mkdirSync(path.join(process.cwd(),destination),{ recursive: true });
                }
                cb(null, destination);
            },
            filename: (_, file, cb) => {
                newFilename = new Date().toISOString().replace(/:/g , "-")+getFileExtension(file.originalname)
                cb(null, newFilename);
            },
        })

        const limits = config.file

        const uploader = multer({storage, limits, fileFilter})

        uploader.single("file")(req, res,function (err) {
            //файлы не появились в uploads
            if (err instanceof multer.MulterError) {
                switch (err.code){
                    case "LIMIT_UNEXPECTED_FILE":
                        // res.send("Превышено максимальное количество файлов для загрузки")
                        next(ApiError.BadRequest("Превышено максимальное количество файлов для загрузки",[]))
                        break;
                    case "LIMIT_FILE_SIZE":
                        // res.send("Превышен максимальный размер файла")
                        next(ApiError.BadRequest("Превышен максимальный размер файла",[]))
                        break;
                    case "LIMIT_FIELD_KEY":
                        // res.send("Название файла слишком длинное")
                        next(ApiError.BadRequest("Название файла слишком длинное",[]))
                        break;
                    default:
                        // res.send(err)
                        next(ApiError.BadRequest(err.message,[]))
                }
                //  if (err.code === 'LIMIT_UNEXPECTED_FILE')


            } else if (err) {
                // next(err.message)
                next(ApiError.BadRequest(err.message,[]))
            }
            else
                // Everything went fine.
                next(newFilename)
        })


    }
}