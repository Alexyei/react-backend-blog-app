import PostModel from "../models/postModel";
import {IPost} from "../models/postModel";

interface createPostPropsInterface extends Omit<IPost,"user">{
    userID:string
}

export async function createPost(props:createPostPropsInterface){
    const {userID, ...restProps} = {...props};
    return await PostModel.create({...restProps, user: userID});
}

export async function findPostByText(text:string){
    return PostModel.findOne({text});
}