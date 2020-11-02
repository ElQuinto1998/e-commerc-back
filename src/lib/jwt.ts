import { SECRET_KEY, MESSAGES, EXPIRE_TIME } from "../config/contants";
import jwt from "jsonwebtoken";
import { IJwt } from "../interfaces/jwt.interface";

class JWT {
  private secretKey = SECRET_KEY as string;

  sign(data: IJwt, expiresIn: number = EXPIRE_TIME.H24) {
    return jwt.sign({ user: data.user }, this.secretKey, {
      expiresIn,
    });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
        return MESSAGES.TOKEN_INVALID;
    }
  }
}

export default JWT;
