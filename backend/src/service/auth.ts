import { User } from "../interface/user";
import * as userService from "../service/user";
import { comparePassword } from "../utils/encrypter";

import config from "../config";
import { sign } from "jsonwebtoken";
import { BadRequestError } from "../error/BadRequestError";

interface CustomJwtPayload {
  email: string;
  id: string;
}

export const login = async (body: Pick<User, "email" | "password">) => {
  const existingUser = await userService.getByEmail(body.email);

  if (!existingUser) {
    return null;
  }
  const userPassword = await comparePassword(
    body.password,
    existingUser.password
  );

  if (!userPassword) throw new BadRequestError("Password doesnt match");

  const user = await userService.getUser(existingUser.id);
  if (!user) throw new BadRequestError("Account doesnt match");

  const roleName = user.roles.map((role) => role.name);
  const permissions = user.roles.flatMap((role) =>
    role.permissions.map((permission) => permission.name)
  );

  const payload = {
    id: user.id,
    email: existingUser.email,
    role: roleName,
    permissions: permissions,
  };

  const secretKey = config.jwt.secret!;
  const accessToken = sign(payload, secretKey, {
    expiresIn: config.jwt.accessExpiration,
  });

  const refreshToken = sign(payload, secretKey, {
    expiresIn: config.jwt.refreshTokenExpiration,
  });
  return { user, accessToken, refreshToken };
};
