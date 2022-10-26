import {body} from "express-validator";
import {findPostByText} from "../dao/postDAO";

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 5 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 5 }).isString().custom((value, {req})=>{
        return findPostByText(value).then(post => {
            if (post !== null) {
                return Promise.reject('Статья с точно таким содержимым уже существует!');
            }
        });
    }),
    body('tags', 'Неверный формат тэгов').optional().isString().custom((value:string, {req})=>{
        const tags = value.split(",").map(tag=>tag.trim())
        const tagsCount = tags.length
        const uniqueTagsCount = new Set(tags).size
        if (tagsCount != uniqueTagsCount) throw new Error("Теги должны быть уникальными!")
        return true;
}),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

export const postUpdateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 5 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 5 }).isString(),
    body('tags', 'Неверный формат тэгов').optional().isString().custom((value:string, {req})=>{
        const tags = value.split(",").map(tag=>tag.trim())
        const tagsCount = tags.length
        const uniqueTagsCount = new Set(tags).size
        if (tagsCount != uniqueTagsCount) throw new Error("Теги должны быть уникальными!")
        return true;
    }),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];