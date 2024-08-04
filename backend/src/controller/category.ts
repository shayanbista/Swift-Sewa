import httpStatusCodes from "http-status-codes";
import { NextFunction, Response } from "express";
import { Request } from "../interface/request";
import * as categoryService from "../service/category";
import { CategoryCompanyQuery } from "../interface/query";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("category controller");

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryService.getAllCategories();
    logger.info("categories fetched successfully");
    res.status(httpStatusCodes.OK).json({ message: categories });
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategory(id);
    logger.info("companies of that categories  fetched successfully");
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const getSearchedCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const search = req.query as string;
    // console.log("search", search);
    // const category = await categoryService.searchCategory(search as string);
    // res.json(category);
  } catch (err) {
    next(err);
  }
};

export const getCompanyByCategory = async (
  req: Request<any, any, any, CategoryCompanyQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    console.log("query", req.query);
    const getCategory = await categoryService.companyByCategory(id, req.query);
    res.status(httpStatusCodes.OK).json({ message: getCategory });
  } catch (err) {
    next(err);
  }
};
