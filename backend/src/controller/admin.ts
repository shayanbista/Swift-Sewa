import httpStatusCodes from "http-status-codes";
import { NextFunction, Response } from "express";
import { Request } from "../interface/request";
import * as adminService from "../service/admin";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("controller/admin");

export const getAllPendingCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companies = await adminService.getAllPendingCompanies();

    logger.info("fetched all pending companies");
    res.status(httpStatusCodes.OK).json(companies);
  } catch (err) {
    next(err);
  }
};

export const getSelectedPendingCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    logger.info("fetched selected compamy");
    const categories = await adminService.getPendingCompanyById(id);
    res.status(httpStatusCodes.OK).json(categories);
  } catch (err) {
    next(err);
  }
};

export const verifyCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const isAllowed = req.body;

    const status = await adminService.verifyCompany(id, isAllowed.isAllowed);

    logger.info("updated Company status successfully");
    res.status(httpStatusCodes.OK).json({ message: status });
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
    const users = await adminService.getUsers(req.query);
    logger.info("fetched all Users");
    res.json(httpStatusCodes.OK).json(users);
  } catch (err) {
    next(err);
  }
};

export const getSelectedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await adminService.getSelectedUser(id);
    logger.info("fetched selected user");
    res.json(httpStatusCodes.OK).json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteSelectedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await adminService.deleteUser(id);
    logger.info("deleted selected user");

    res.status(httpStatusCodes.NO_CONTENT);
  } catch (err) {
    next(err);
  }
};
