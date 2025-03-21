import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import {
  checkPassword,
  registerUserToken,
  verifyAdmin,
  verifyUser,
} from "../services/auth";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (!(await checkPassword(password, user?.password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (!process.env.JWT_PRIVATE_KEY) {
    res.status(500).json({ error: "JWT private key is not defined" });
    return;
  }

  const token = registerUserToken(user.id);

  res.json({ success: true, user: token });
  return;
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = registerUserToken(user.id);

    res.json({ success: true, user: token });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to create user: " + error });
    return;
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization
    ? req.headers.authorization
    : String(req.query.token);

  const adminToken = String(req.headers.admintoken);

  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  try {
    console.log(adminToken, token);
    const { id, role } = verifyUser(token);
    if (!id && !role) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token: " + err });
    return;
  }
}
