import { User } from "./../interface/user";
import httpStatusCodes from "http-status-codes";
import { NextFunction } from "express";
import * as authService from "../service/auth";
import { Response } from "express";
import { NotFoundError } from "../error/NotFoundError";
import { Request } from "../interface/request";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  try {
    const data = await authService.login(body);

    if (!data) {
      next(new NotFoundError("login failed"));
      return;
    }
    res.status(httpStatusCodes.OK).json({ message: data });
  } catch (err) {
    next(err);
  }
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user?.role;
    const user1 = req.user;
    console.log("user", user1);

    res.status(httpStatusCodes.OK).json({ role: user });
  } catch (err) {
    console.log("err", err);
  }
};
