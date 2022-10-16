import { validationResult } from 'express-validator';
import {NextFunction, Request, Response} from "express";
import errorMiddleware from "./errorMiddleware";
import ApiError from "../exceptions/ApiError";

export default (err:any, req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorMiddleware(ApiError.BadRequest(errors.array()[0].msg, errors.array()), req,res,next)
    }

    next();
};