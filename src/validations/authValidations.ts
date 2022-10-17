import { body } from 'express-validator';
import {findUserByEmail, findUserByLogin} from "../dao/userDAO";

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail().custom((value) => {
        return findUserByEmail(value).then(user => {
            if (user !== null) {
                return Promise.reject('Такой E-mail уже используется');
            }
        });
    }),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('confirmPassword').custom((value, {req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают');
        }
        return true;
    }),
    body('login', 'Укажите логин').isLength({ min: 3 }).custom(value => {
        return findUserByLogin(value).then(user => {
            if (user !== null) {
                return Promise.reject('Такой login уже используется');
            }
        });
    }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
