import { NextFunction, Request, Response } from "express";
import { registerAdminToken, verifyAdmin } from "../services/auth";

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
  const token = String(req.query.token);

  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  const { role } = verifyAdmin(token);
  if (role !== "admin") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
