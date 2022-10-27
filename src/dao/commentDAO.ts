import CommentModel, {IComment} from "../models/commentsModel";
import mongoose from "mongoose";
import {getRandom} from "../utils/array";
import { faker } from '@faker-js/faker';

export async function deleteAllComments(){
    return CommentModel.deleteMany();
}

export async function seedComments(usersIDs:string[],postsIDs:string[],count:number=10000){
    for(let i=0;i<count;++i){
        let comment:IComment = {author: new mongoose.Types.ObjectId(getRandom(usersIDs)), text: faker.lorem.sentence(), owner: new mongoose.Types.ObjectId(getRandom(postsIDs))}
        //console.log((await CommentModel.aggregate().match({ owner: comment.owner }).project({_id: 1})).map(item=>item._id))
        //console.log()
        const parents:string[] = (await CommentModel.aggregate().match({ owner: comment.owner }).project({_id: 1})).map(item=>item._id)
        // // if (!parents)
        //     console.log(parents.length)
        if (Math.random()>0.3 && parents.length){

            comment = {...comment, parent: new mongoose.Types.ObjectId(getRandom(parents))}
        }
        const createdComment = await CommentModel.create(comment);
    }
}