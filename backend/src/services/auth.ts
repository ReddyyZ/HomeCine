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
  if (!token) {
    return { id: "" };
  }

  return jwt.verify(token, process.env.JWT_PRIVATE_KEY) as { id: string };
}

interface RegisterAdminTokenReturn {
  token?: string;
}

export function registerAdminToken(
  user: string,
  password: string,
): RegisterAdminTokenReturn {
  if (
    user !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { token: undefined };
  }

  try {
    const token = jwt.sign(
      { role: "admin" },
      String(process.env.JWT_PRIVATE_KEY),
      {
        expiresIn: "7d",
      },
    );
    return { token };
  } catch (error) {
    console.error("Failed to generate token", error);
    return { token: undefined };
  }
}

export function verifyAdmin(token: string): { role: string } {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT private key is not defined");
  }

  try {
    const result = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as {
      role: string;
    };

    return result;
  } catch (error) {
    console.error("Failed to verify token");
    return { role: "" };
  }
}
