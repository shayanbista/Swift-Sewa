import httpStatusCodes from "http-status-codes";
import { NextFunction, Response } from "express";
import { Request } from "../interface/request";
import * as bookingService from "../service/booking";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("booking controller");

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id!;
    const data = req.body;

    data.userId = userId;
    const booking = await bookingService.createBooking(data);
    logger.info("booking successful");
    res.status(httpStatusCodes.CREATED).json("successful");
  } catch (err) {
    next(err);
  }
};

export const viewBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplierId = req.user?.id!;
    console.log("query", req.query);
    logger.info("booking successful");
    const bookings = await bookingService.viewBookings(supplierId, req.query);
    res.status(httpStatusCodes.OK).json({ bookings });
  } catch (err) {
    next(err);
  }
};

export const verifyBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const status = req.body.isApproved;
    const booking = await bookingService.verifyUserBooking(id, status);
    res.status(httpStatusCodes.OK).json(booking);
  } catch (err) {
    next(err);
  }
};
