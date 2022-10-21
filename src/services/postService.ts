import {
    createPost, deletePost,
    findOneAndUpdate,
    findPostByIDAndUser, findPostByText,
    getAllPostWithUserData,
    IPostCreateProps, latestPosts,
    updateMainImage, updatePost
} from "../dao/postDAO";
import ApiError from "../exceptions/ApiError";
import PostWithUserDto from "../dto/postDTO";
import {IPost} from "../models/postModel";
import path from "path";
import fs from "fs";


class PostService {
    async getLatestTags() {
        const posts = await latestPosts();


        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
            .slice(0, 5);

        return tags;
    }

    async getOne(postID: string) {
        const post = await findOneAndUpdate(postID);

        if (!post) {
            throw ApiError.BadRequest('Пост с таким id не найден')
        }

        return new PostWithUserDto(post);
    }

    async create(props: IPostCreateProps) {
        props.imageUrl = undefined;
        const new_post = await createPost(props)

        return this.getOne(new_post._id)
    }

    async update(postID: string, props: IPostCreateProps) {
        const userID = props.userID;

        const post = await findPostByIDAndUser(postID, userID)
        if (!post) {
            throw ApiError.BadRequest('Пост с таким id и user id не найден')
        }

        if (post.text != props.text){
            const similarPost = await findPostByText(props.text)

            if (similarPost !== null) {
                throw ApiError.BadRequest('Статья с точно таким содержимым уже существует!');
            }
        }

        const newImgUrl = await this.updateMainImage(userID,postID,props.imageUrl,post.imageUrl)


        props.imageUrl = newImgUrl;

        const updated = await updatePost(postID, props);

        return {id: post._id}
    }

    async delete(postID: string, userID: string) {
        const post = await findPostByIDAndUser(postID, userID)
        if (!post) {
            throw ApiError.BadRequest('Пост с таким id и user id не найден')
        }

        const deleted = await deletePost(postID) as any

        return {id: deleted._id}
    }

    async saveMainImage(userID: string, postID: string, imageUrl?: string) {

        const filePath = path.join(process.cwd(), `${imageUrl}`)
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            if (imageUrl?.startsWith(`uploads/temp/${userID}/post/main/new/`)) {
                const newUrlBase = `uploads/post/${postID}/main/`
                const newUrl = `${newUrlBase}${imageUrl?.split("/").pop()}`
                const newFilePath = path.join(process.cwd(), `${newUrl}`)

                //create dir
                if (!fs.existsSync(path.join(process.cwd(), newUrlBase))) {
                    fs.mkdirSync(path.join(process.cwd(), newUrlBase), {recursive: true});
                }


                fs.renameSync(filePath, newFilePath)

                await updateMainImage(postID, imageUrl)

                return newUrl;
            }
        }
    }

    async updateMainImage(userID: string, postID: string, newImageUrl?: string, lastImageUrl?: string) {
        if (lastImageUrl != newImageUrl) {
            const filePath = path.join(process.cwd(), `${newImageUrl}`)
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                if (newImageUrl?.startsWith(`uploads/temp/${userID}/post/main/${postID}/`)) {
                    const newUrlBase = `uploads/post/${postID}/main/`
                    const newUrl = `${newUrlBase}${newImageUrl?.split("/").pop()}`
                    const newFilePath = path.join(process.cwd(), `${newUrl}`)

                    //create dir
                    if (!fs.existsSync(path.join(process.cwd(), newUrlBase))) {
                        fs.mkdirSync(path.join(process.cwd(), newUrlBase), {recursive: true});
                    }


                    fs.renameSync(filePath, newFilePath)

                    await updateMainImage(postID, newImageUrl)

                    return newUrl;
                }
            }
        }

        return  lastImageUrl;
    }


    async getAll() {
        const posts = await getAllPostWithUserData()
        return posts.map(p => new PostWithUserDto(p));
    }
}

export default new PostService();

