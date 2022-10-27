import mongoose, {Document, model, Schema} from "mongoose";



export interface IComment{
    text: string,
    owner:mongoose.Types.ObjectId,
    author:mongoose.Types.ObjectId,
    parent?:mongoose.Types.ObjectId
}

export interface ICommentDocument extends  Document, IComment{
    createdAt:string
}

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
}, {
    timestamps: true,
},)

export default model<ICommentDocument>('Comment', CommentSchema);
