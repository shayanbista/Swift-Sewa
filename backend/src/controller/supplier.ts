import httpStatusCodes from "http-status-codes";
import { NextFunction, Response } from "express";
import * as supplierService from "../service/supplier";
import { Request } from "../interface/request";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("SupplierController");

export const registerCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user?.id!;

  const serviceIds = JSON.parse(req.body.serviceIds);
  const servicePrices = JSON.parse(req.body.price);
  req.body.price = servicePrices;
  req.body.serviceIds = serviceIds;
  req.body.userId = id;

  try {
    const imageFiles = req.files as { [key: string]: Express.Multer.File[] };

    const newCompany = await supplierService.registerCompany(
      req.body,
      imageFiles,
      id
    );

    logger.info("created succesfully");
    res.status(httpStatusCodes.OK).json({
      message:
        "Successful.Your company has been forwarded to the admin for verification",
    });
  } catch (err) {
    next(err);
  }
};

export const getSuppliersCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id!;
    const companies = await supplierService.getCompanies(userId);
    logger.info("fetched companies successfully");
    res.status(httpStatusCodes.OK).json({ companies });
  } catch (err) {
    next(err);
  }
};

export const getSpecificCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id!;
    const companies = await supplierService.getCompany(id, userId);
    logger.info("fetched companies successfully");
    res.status(httpStatusCodes.OK).json({ companies });
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id!;
  const { id } = req.params;
  const data = req.body;

  console.log("data", data);

  const imageFiles = req.files as { [key: string]: Express.Multer.File[] };

  try {
    const update = await supplierService.updateCompany(
      id,
      data,
      imageFiles,
      String(userId)
    );
    logger.info("updated succesfully");
    res.status(httpStatusCodes.OK).json({ message: "updated successfully" });
  } catch (err) {
    logger.error("error occured", err);
    next(err);
  }
};

export const deleteCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id!;

    const companies = await supplierService.deleteCompany(id, userId);
    logger.info("delted succesfully");
    res
      .status(httpStatusCodes.NO_CONTENT)
      .json({ message: "deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteSelectedcompanyService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ids = req.body;

  const userId = req.user?.id;
  ids.userId = userId;
  console.log("this id is called");

  try {
    const deltedService = await supplierService.deleteSelectedcompanyService(
      ids
    );

    res.status(httpStatusCodes.NO_CONTENT).json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};
