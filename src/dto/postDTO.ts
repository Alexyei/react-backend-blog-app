//DTO - data transfer object

import {IUser, IUserDocument} from "../models/userModel";
import mongoose from "mongoose";
import {IPost, IPostDocument} from "../models/postModel";
import UserDto from "./userDTO";

export interface IPostWithUserDTO extends Omit<IPost, "user">{
    id: string;
    user: UserDto
}

export default class PostWithUserDto implements IPostWithUserDTO{
    id: string;
    imageUrl?: string;
    tags: string[];
    text: string;
    title: string;
    user: UserDto
    viewsCount: number;


    constructor(model:IPostDocument) {
        this.imageUrl = model.imageUrl;
        this.id = model._id;
        this.tags = model.tags;
        this.text = model.text;
        this.title = model.title;
        this.viewsCount = model.viewsCount

        this.user = new UserDto(model.user as any)
    }


}