import {IUserDocument} from "../models/userModel";
import bcrypt from "bcrypt";
import ApiError from "../exceptions/ApiError";
import UserDto from "../dto/userDTO";
import {createUser, findUserByEmail, findUserByID} from "../dao/userDAO";


class UserService {
    async registration(email:string, login:string, password:string,avatarUrl?:string) {
        const hashPassword = await bcrypt.hash(password, 3);

        const user:IUserDocument = await createUser({email, login, hashPassword,avatarUrl})



        const userDto = new UserDto(user);


        return userDto;
    }

    async login(email:string, password:string) {
        const user = await findUserByEmail(email)
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный email или пароль');
        }
        const userDto = new UserDto(user);

        return userDto;
    }

    async getUserData(userID:string){
        const user = await findUserByID(userID)
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким id не найден')
        }

        const userDto = new UserDto(user);
        return userDto;
    }
}

export default new UserService();
