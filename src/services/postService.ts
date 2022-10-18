import {
    createPost, deletePost,
    findOneAndUpdate,
    findPostByIDAndUser,
    getAllPostWithUserData,
    IPostCreateProps, latestPosts,
    updateMainImage
} from "../dao/postDAO";
import ApiError from "../exceptions/ApiError";
import PostWithUserDto from "../dto/postDTO";
import {IPost} from "../models/postModel";
import path from "path";
import fs from "fs";


class PostService {
    async getLatestTags(){
        const posts = await latestPosts();



        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .filter((value, index, self)=>self.indexOf(value) === index)
            .slice(0, 5);

        return tags;
    }

    async getOne(postID:string) {
        const post = await findOneAndUpdate(postID);

        if (!post) {
            throw ApiError.BadRequest('Пост с таким id не найден')
        }

        return new PostWithUserDto(post);
    }

    async create(props:IPostCreateProps){
        const new_post = await createPost(props)

        return this.getOne(new_post._id)
    }

    async delete(postID:string, userID:string){
        const post = await findPostByIDAndUser(postID, userID)
        if (!post){
            throw ApiError.BadRequest('Пост с таким id и user id не найден')
        }

        const deleted = await deletePost(postID) as any

        return {id:deleted._id}
    }

    async saveMainImage(userID:string,postID:string, imageUrl?:string ){

        const filePath = path.join(process.cwd(), `${imageUrl}`)
        if(fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()){
            if (imageUrl?.startsWith( `uploads/temp/${userID}/post/main/new/`)){
                const newUrlBase = `uploads/post/${postID}/main/`
                const newUrl = `${newUrlBase}${imageUrl?.split("/").pop()}`
                const newFilePath = path.join(process.cwd(), `${newUrl}`)

                //create dir
                if (!fs.existsSync(path.join(process.cwd(),newUrlBase))) {
                    fs.mkdirSync(path.join(process.cwd(),newUrlBase),{ recursive: true });
                }


                fs.renameSync(filePath,newFilePath)

                await updateMainImage(postID,imageUrl)

                return newUrl;
            }
        }
    }

    async getAll() {
        const posts = await getAllPostWithUserData()
        console.log(posts[0].user)
        return posts.map(p=>new PostWithUserDto(p));
    }
}

export default new PostService();

