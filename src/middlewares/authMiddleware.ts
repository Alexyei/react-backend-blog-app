import {NextFunction, Request, Response} from "express";
import ApiError from "../exceptions/ApiError";
import jwtService from "../services/jwtService"
import errorMiddleware from "./errorMiddleware";

declare global {
    namespace Express {
        interface Request {
            userID: string;
        }
    }
}

export default async function (req: Request, res:Response, next: NextFunction) {

    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return errorMiddleware(ApiError.UnauthorizedError(), req,res,next);
    }
    // const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const token = authorizationHeader.split(' ')[1];

    if (token) {
        try {
            req.userID = (await jwtService.verify(token))._id;
            next();
        } catch (e) {
            return errorMiddleware(ApiError.UnauthorizedError(), req,res,next);
        }
    } else {
        return errorMiddleware(ApiError.UnauthorizedError(), req,res,next);
    }
}