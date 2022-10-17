import {model, Schema, Document} from "mongoose";

export interface IUser{
    email: string,
    password: string,
    login: string,
    avatarUrl?: string,
}

export interface IUserDocument extends  Document, IUser{}

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    login: {type: String, unique:true, required: true},
    avatarUrl: {type:String},
}, {
    timestamps: true,
},)

export default model<IUserDocument>('User', UserSchema);