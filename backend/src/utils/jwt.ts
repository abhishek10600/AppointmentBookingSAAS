import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtUserPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const JWT_ACCESSTOKEN_EXPIRY = process.env
  .JWT_ACCESSTOKEN_EXPIRY as SignOptions["expiresIn"];

const JWT_REFRESHTOKEN_EXPIRY = process.env
  .JWT_REFRESHTOKEN_EXPIRY as SignOptions["expiresIn"];

export const generateAccessToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: JWT_ACCESSTOKEN_EXPIRY,
  };
  return jwt.sign({ userId }, JWT_SECRET, options);
};

export const generateRefreshToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: JWT_REFRESHTOKEN_EXPIRY,
  };
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): IJwtUserPayload => {
  return jwt.verify(token, JWT_SECRET) as IJwtUserPayload;
};

export const verifyRefershToken = (token: string): IJwtUserPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as IJwtUserPayload;
};
