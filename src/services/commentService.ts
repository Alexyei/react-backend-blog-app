import { deleteAllComments, seedComments} from "../dao/commentDAO";
import userService from "./userService";
import postService from "./postService";

class CommentService{
    async seedComments(){

        await deleteAllComments();

        const usersIDs = await userService.getUsersID()
        //console.log(users);
        const postsIDs = await postService.getPostsID()

        await seedComments(usersIDs,postsIDs)
    }
}

export default new CommentService();