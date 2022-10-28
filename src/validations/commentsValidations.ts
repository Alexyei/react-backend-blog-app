import {body} from "express-validator";
import {findPostByID} from "../dao/postDAO";
import {findCommentByPostIDAndID} from "../dao/commentDAO";

export const commentCreateValidation = [
    body('text', 'Введите текст комментария').isLength({ min: 5 }).isString(),
    body('owner', 'Укажите статью для комментария').isString().custom((value:string, {req})=>{
        return findPostByID(value).then(post => {
            if (post == null) {
                return Promise.reject('Пост с таким id не найден!');
            }
        });
    }),
    body('parent', 'Укажите комментарий-родитель').optional().isString().custom((value:string, {req})=>{
        return findCommentByPostIDAndID(req.body.owner,value).then(post => {
            if (post == null) {
                return Promise.reject('Комментарий-родитель не найден!');
            }
        });
    }),
]