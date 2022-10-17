import UserModel, {IUser} from "../models/userModel";
import mongoose from "mongoose";

interface createUserPropsInterface extends Omit<IUser,"password">{
    hashPassword: string,
}

export async function createUser(props:createUserPropsInterface){
   return await UserModel.create({email: props.email, login: props.login, password: props.hashPassword, avatarUrl: props.avatarUrl});
}

export async function findUserByEmail(email:string){
   return UserModel.findOne({email});
}

export async function findUserByLogin(login:string){
   return UserModel.findOne({login});
}

export async function findUserByID(userID:string){
    return UserModel.findOne({_id:new mongoose.Types.ObjectId(userID)});
}

