import httpStatusCodes from "http-status-codes";
import { NextFunction } from "express";
import * as userService from "../service/user";
import { Response } from "express";
import { Request } from "../interface/request";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email, password, role, name, address, phoneNumber } = req.body;

  try {
    const data = await userService.createUser(
      email,
      password,
      role,
      name,
      address,
      phoneNumber
    );

    res.status(httpStatusCodes.CREATED).json({ message: "signup success" });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.status(httpStatusCodes.OK).json({ message: users });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = req.user!?.id;

  const user = await userService.getUserProfile(id);

  if (!user) {
    next(new BadRequestError("user not found"));
    return;
  }
  res
    .status(httpStatusCodes.OK)
    .json({ message: "user fetched successfully", data: user });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user!?.id;

  const { email, name, address, phoneNumber } = req.body;

  try {
    const updatedProfile = await userService.updateUserProfile(
      id,
      email,
      name,
      address,
      phoneNumber
    );

    if (!updatedProfile) {
      next(new BadRequestError("User not found"));
      return;
    }

    res.status(httpStatusCodes.OK).json({ message: "successfully updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedUser = await userService.deleteUser(parseInt(id));
    if (!deletedUser) {
      next(new NotFoundError("User not found"));
      return;
    }

    res
      .status(httpStatusCodes.NO_CONTENT)
      .json({ message: "deleted successully" });
  } catch (error) {
    next(error);
  }
};
