import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { ErrorResponse, INVALID_EMAIL, PASSWORD_TOO_SHORT } from "./errors";

export const encodeJWT = (email: string): string => {
  return jwt.sign({ email: email }, "secretkey", {
    expiresIn: "3day",
    algorithm: "HS256",
  });
};

export const decodeJWT = (token: string): string => {
  const decoded: jwt.JwtPayload = jwt.verify(
    token,
    "secretkey",
  ) as jwt.JwtPayload;
  if (decoded.email) {
    return decoded.email;
  } else {
    throw new Error("failed jwt decoded");
  }
};

export const encodePasswordDigest = async (
  password: string,
): Promise<string> => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Failed to generate password digest");
  }
};

export const comparePassword = async (
  password: string,
  passwordDigest: string,
): Promise<boolean> => {
  return await bcryptjs.compare(password, passwordDigest);
};

export const validateParams = (
  email: string,
  password: string,
): ErrorResponse | undefined => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!pattern.test(email)) {
    return INVALID_EMAIL;
  }

  if (password.length < 6) {
    return PASSWORD_TOO_SHORT;
  }

  return undefined;
};
