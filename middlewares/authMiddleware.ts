import {NextFunction, Request, Response} from "express";
import ApiError from "../exceptions/ApiError";
import jwt from 'jsonwebtoken';
import config from "../configs/default"
import jwtService from "../services/jwtService"

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
        return next(ApiError.UnauthorizedError());
    }
    // const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const token = authorizationHeader.split(' ')[1];

    if (token) {
        try {
            req.userID = (await jwtService.verify(token))._id;
            next();
        } catch (e) {
            next(ApiError.UnauthorizedError());
        }
    } else {
        next(ApiError.UnauthorizedError());
    }
}