//DTO - data transfer object

import {IUser, IUserDocument} from "../models/userModel";
import mongoose from "mongoose";

export interface IUserDTO extends Omit<IUser, "password" | "email">{
    id: string;
}

export default class UserDto implements IUserDTO{
    // email;
    login;
    id;
    avatarUrl;

    constructor(model:IUserDocument) {
        // this.email = model.email;
        this.id = model._id;
        this.login = model.login;
        this.avatarUrl = model.avatarUrl;
    }
}