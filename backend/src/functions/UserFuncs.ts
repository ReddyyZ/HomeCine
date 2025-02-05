import User from "../models/User";
import { verifyUser } from "../services/auth";

export function getUserById(id: string) {
  return User.findByPk(id);
}

export async function getUserByToken(token: string) {
  if (!token) {
    return;
  }

  const { id } = verifyUser(token);
  if (!id) {
    return;
  }

  return User.findByPk(id);
}

export async function updateUser(id: string, data: Partial<User>) {
  const user = await getUserById(id);
  if (!user) {
    return;
  }

  return user.update(data);
}
