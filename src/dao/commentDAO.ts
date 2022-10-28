import CommentModel, {IComment} from "../models/commentsModel";
import mongoose from "mongoose";
import {getRandom} from "../utils/array";
import { faker } from '@faker-js/faker';
import {IPost} from "../models/postModel";

export interface ICommentCreateProps{
    text:string
    owner:string,
    author:string,
    parent?:string
}

export async function createComment(props:ICommentCreateProps){
    const mongoProps = {
        owner: new mongoose.Types.ObjectId(props.owner),
        author: new mongoose.Types.ObjectId(props.author),
        parent: props.parent ? new mongoose.Types.ObjectId(props.parent): props.parent
    }

    return CommentModel.create({...props,...mongoProps})
}

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

export async function getRootComments(postID:string){
    return CommentModel.aggregate().match({owner:new mongoose.Types.ObjectId(postID), parent:null}).sort({createdAt:-1})
}

export async function findCommentByPostIDAndID(postID:string, commentID:string){
    return CommentModel.aggregate().match({owner:new mongoose.Types.ObjectId(postID), _id:new mongoose.Types.ObjectId(commentID)})

}

export async function getPostCommentsCount(postID:string){
    return CommentModel.find({owner:new mongoose.Types.ObjectId(postID)}).count()
}

export async function getNestedComments(commentID:string){
    return CommentModel.aggregate()
        .match({ _id:commentID})
        .lookup({ from: 'users', localField: 'author', foreignField: '_id', as: 'author'})
        .unwind('author')
        .graphLookup({from:'comments', startWith: '$_id', connectFromField: '_id',connectToField: 'parent', as: 'replies',depthField: "level"})


        // .unwind({path:'$replies.author', preserveNullAndEmptyArrays: true})
        //.addFields({'replies.author':{$first: '$replies.author'}})
        // .addFields({'replies':{$cond: [ '$replies.author', '$replies', '$replies.replies' ]}})

         .unwind({path:"$replies",  preserveNullAndEmptyArrays: true})
        .lookup({ from: 'users', localField: 'replies.author', foreignField: '_id', as: 'replies.author'})
        .addFields({'replies.author':{$first: '$replies.author'}})
        //
        .addFields({'replies':{$cond: [ '$replies.author', '$replies', '$replies.replies' ]}})
        .project({_id: 1, "author._id":1,"author.login":1,isDeleted:1,text:1,createdAt:1,"replies._id":1,"replies.parent":1,
            // "replies.author":1,
            "replies.author._id":1,"replies.author.login":1,
            "replies.level":1,"replies.text":1,"replies.createdAt":1,"replies.isDeleted":1})
        .sort({"replies.level":-1,"replies.createdAt":-1})
        // // .project({ "author":1,
        // //     text:1,
        // //     createdAt:1,
        // //     level:1,
        // //     "replies.author":1,
        // //     "replies.text":1,
        // //     "replies.createdAt":1,
        // //     "replies.level":-1,
        // // })
        //
        .group({_id: "$_id",author : { $first: '$author' }, text: {$first: '$text'}, replies: { $push: "$replies" },isDeleted: {$first: '$isDeleted'},createdAt: {$first: '$createdAt'}, })
        .addFields({replies: {
                $reduce: {
                    input: "$replies",
                    initialValue: {
                        currentLevel: -1,
                        currentLevelProjects: [],
                        previousLevelProjects: [],
                    },
                    in: {
                        $let: {
                            vars: {
                                prev: {
                                    $cond: [
                                        { $eq: [ "$$value.currentLevel", "$$this.level" ] },
                                        "$$value.previousLevelProjects",
                                        "$$value.currentLevelProjects"
                                    ]
                                },
                                current: {
                                    $cond: [
                                        { $eq: [ "$$value.currentLevel", "$$this.level" ] },
                                        "$$value.currentLevelProjects",
                                        []
                                    ]
                                }
                            },
                            in: {
                                currentLevel: "$$this.level",
                                previousLevelProjects: "$$prev",
                                currentLevelProjects: {
                                    $concatArrays: [
                                        "$$current",
                                        [
                                            { $mergeObjects: [
                                                    "$$this",
                                                    { replies: { $filter: { input: "$$prev", as: "e", cond: { $eq: [ "$$e.parent", "$$this._id"  ] } } }, "ad": {$size: { $filter: { input: "$$prev", as: "e", cond: { $eq: [ "$$e.parent", "$$this._id"  ] } }}} },
                                                ] },

                                        ]
                                    ]
                                }
                            }
                        }
                    }
                }
            }})
        .addFields({ replies: "$replies.currentLevelProjects" })
        .addFields({add: {$size: "$replies.ad"}})

}