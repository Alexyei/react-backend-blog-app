import jwt from "jsonwebtoken";
import config from "../configs/default"

export interface JwtPayload {
    _id: string
}

class JwtService {
    async sign(payload:JwtPayload){
        const token = jwt.sign(
            payload,
            config.jwt.secret,
            {
                expiresIn: config.jwt.expiresIn,
            },
        );

        return token;
    }

    async verify(token:string){
        return jwt.verify(token, config.jwt.secret) as JwtPayload;
    }
}

export default new JwtService()