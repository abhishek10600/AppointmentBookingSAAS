import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtUserPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_TOKEN_EXPIRY = process.env
  .JWT_TOKEN_EXPIRY as SignOptions["expiresIn"];

export const generateToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: JWT_TOKEN_EXPIRY,
  };
  return jwt.sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string): IJwtUserPayload => {
  return jwt.verify(token, JWT_SECRET) as IJwtUserPayload;
};
