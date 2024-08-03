import { getCompanies } from "./../service/supplier";
import httpStatusCodes from "http-status-codes";
import { NextFunction, Response } from "express";
import { Request } from "../interface/request";
import * as companyService from "../service/services";
import { ServiceCompanyQuery } from "../interface/query";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("service controller");

export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await companyService.getAllServices();
    res.status(httpStatusCodes.OK).json({ message: services });
  } catch (err) {
    next(err);
  }
};

export const getCompaniesByService = async (
  req: Request<any, any, any, ServiceCompanyQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.query", req.query);
    const getCompanies = await companyService.getCompaniesByService(req.query);
    logger.info("companies fetched successfully");
    res.status(httpStatusCodes.OK).json(getCompanies);
  } catch (err) {
    next(err);
  }
};
