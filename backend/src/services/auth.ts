import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 2);
}

export function checkPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function registerUserToken(id: string): string {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT private key is not defined");
  }

  return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "7d",
  });
}

export function verifyUser(token: string): { id: string } {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT private key is not defined");
  }

  return jwt.verify(token, process.env.JWT_PRIVATE_KEY) as { id: string };
}
