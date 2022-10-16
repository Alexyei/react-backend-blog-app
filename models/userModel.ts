import {model, Schema, Document} from "mongoose";

export interface IUserDocument extends  Document{
    email: string,
    password: string,
    login: string,
    avatarUrl: String,
}

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    login: {type: String, required: true},
}, {
    timestamps: true,
},)

export default model<IUserDocument>('User', UserSchema);