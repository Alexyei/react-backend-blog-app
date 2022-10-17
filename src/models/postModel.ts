import mongoose, {model, Schema, Document} from "mongoose";

export interface IPost{
    title: string,
    text: string,
    tags: string,
    viewCount:number,
    user:mongoose.Types.ObjectId,
    imageUrl?:string
}

export interface IPostDocument extends  Document, IPost{}

const PostSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String,
}, {
    timestamps: true,
},)

export default model<IPostDocument>('Post', PostSchema);