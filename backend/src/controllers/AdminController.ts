import { NextFunction, Request, Response } from "express";
import { registerAdminToken, verifyAdmin, verifyUser } from "../services/auth";

export async function login(req: Request, res: Response) {
  const { user, password } = req.body;

  // Check if user exists
  const { token } = registerAdminToken(user, password);
  // Check if password is correct
  if (token) {
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
  // Generate token
  // Return token
}

export async function adminAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.query.token ? req.query.token : req.headers.admintoken;
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  const { role } = verifyUser(String(token));
  if (role !== "admin") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
