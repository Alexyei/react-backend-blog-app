import PostModel from "../models/postModel";
import {IPost} from "../models/postModel";
import mongoose from "mongoose";

export interface IPostCreateProps extends Omit<IPost,"user"|"viewsCount">{
    userID:string
}

export async function createPost(props:IPostCreateProps){
    const {userID, ...restProps} = {...props};
    return await PostModel.create({...restProps, user: new mongoose.Types.ObjectId(userID)});
}

export async function updateMainImage(postID:string,imageUrl:string){
    return PostModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId(postID)},{imageUrl});
}

export async function updatePost(postID:string,props:IPostCreateProps){
    const {userID, ...restProps} = {...props};
    await PostModel.updateOne(
        {
            _id: new mongoose.Types.ObjectId(postID),
        },
        {
            ...restProps, user: new mongoose.Types.ObjectId(userID)
        },
    );
}

export async function deletePost(postID:string){
    return PostModel.findOneAndDelete({_id:new mongoose.Types.ObjectId(postID)});
}

export async function latestPosts(limit=5){
    return PostModel.find().limit(5);
}
export async function findPostByIDAndUser(id:string,userID:string){
    return PostModel.findOne({user:new mongoose.Types.ObjectId(userID),_id:new mongoose.Types.ObjectId(id)});
}

export async function findPostByText(text:string){
    return PostModel.findOne({text});
}

export async function getAllPostWithUserData(){
    return PostModel.aggregate()
        .lookup({ from: 'users', localField: 'user', foreignField: '_id', as: 'user' })
        .unwind("user")
        .project({_id:1,title:1,text:1,tags:1,viewsCount:1,imageUrl:1,createdAt:1,"user._id":1,"user.login":1})
}

export async function findOneAndUpdate(postID:string){
    return PostModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId(postID)},{$inc: { viewsCount: 1 }},{returnDocument: 'after'}).populate({"path":"user", "model":"User"});
}

export async function getPostWithUserData(postID:string){
    return PostModel.aggregate().match({_id:new mongoose.Types.ObjectId(postID)})
        .lookup({ from: 'users', localField: 'user', foreignField: '_id', as: 'user' })
        .project({_id:1,title:1,text:1,tags:1,viewsCount:1,createdAt:1,imageUrl:1,"user._id":1,"user.login":1})
}

