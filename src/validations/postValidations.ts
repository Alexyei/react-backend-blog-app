import {body} from "express-validator";
import {findPostByText} from "../dao/postDAO";

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString().custom((value, {req})=>{
        return findPostByText(value).then(post => {
            if (post !== null) {
                return Promise.reject('Статья с точно таким содержимым уже существует!');
            }
        });
    }),
    body('tags', 'Неверный формат тэгов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];