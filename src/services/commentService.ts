import {
    createComment,
    deleteAllComments,
    getNestedComments,
    getPostCommentsCount,
    getRootComments, ICommentCreateProps,
    seedComments
} from "../dao/commentDAO";
import userService from "./userService";
import postService from "./postService";
import {IComment, ICommentDocument} from "../models/commentsModel";
import {findPostByID, findPostByIDAndUser} from "../dao/postDAO";
import ApiError from "../exceptions/ApiError";

class CommentService{

    async createComment(props:ICommentCreateProps){
        const comment = await createComment(props)
        return comment._id.toString()
    }
    async seedComments(){

        await deleteAllComments();

        const usersIDs = await userService.getUsersID()
        //console.log(users);
        const postsIDs = await postService.getPostsID()

        await seedComments(usersIDs,postsIDs,10000)
    }

    async getPostComments(postID:string){

        const post = await findPostByID(postID)
        if (!post) {
            throw ApiError.BadRequest('Пост с таким id и не найден')
        }

        const rootComments:ICommentDocument[] = await getRootComments(postID)

        const allComments = await rootComments.reduce<Promise<any[]>>(async (result, current)=>{
            const nestedComments = await getNestedComments(current._id)
            return [...(await result), nestedComments[0]]
        },Promise.resolve([]))
        return {comments:allComments,count: await getPostCommentsCount(postID)}
    }
}

export default new CommentService();