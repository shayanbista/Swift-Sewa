import { booking } from "../interface/booking";

import { findUserByCompany } from "./user";
import loggerWithNameSpace from "../utils/logger";
import { companyServiceExists } from "./companytoservice";
import { BadRequestError } from "../error/BadRequestError";
import { Booking } from "../entity/Booking";
import { ServiceToCompany } from "../entity/Company_Service";
import { User } from "../entity/User";
import { Company } from "../entity/Company";
import { AppDataSource } from "../dataSource";
import * as supplierService from "./supplier";
import { In } from "typeorm";

const bookRepository = AppDataSource.getRepository(Booking);
const logger = loggerWithNameSpace("BookingService");

const findBookingById = async (id: number) => {
  return await bookRepository.findOneBy({ id });
};

const update = async (id: number, status: boolean) => {
  return await bookRepository.update({ id }, { isApproved: status });
};

const deleteBooking = async (id: number) => {
  return await bookRepository.softDelete({ id });
};

const create = async (data: booking) => {
  const booking = new Booking();
  booking.contactName = data.contactName;
  booking.phoneNumber = data.phoneNumber;
  booking.contactAddress = data.contactAddress;
  booking.isApproved = false;
  booking.bookedDate = data.bookedDate;
  booking.user = data.userId as unknown as User;
  booking.company = data.companyId as unknown as Company;
  booking.serviceToCompany =
    data.companyServiceId as unknown as ServiceToCompany;
  booking.specialInstructions = data.specialInstructions;

  await bookRepository.save(booking);
  return booking;
};

const findBookings = async (companyIds: number[]) => {
  const bookings = await bookRepository.find({
    where: {
      company: {
        id: In(companyIds),
      },
      isApproved: false,
    },
    relations: ["company", "serviceToCompany.service"],
  });
  return bookings;
};

export const createBooking = async (data: booking) => {
  const supplierExists = await findUserByCompany(data.companyId);

  if (!supplierExists) throw new BadRequestError("supplier not found");

  const serviceExists = await companyServiceExists(
    data.companyServiceId,
    data.companyId
  );

  if (!serviceExists) throw new BadRequestError("service doesnt exist");

  const newBooking = await create(data);
  return newBooking;
};

export const viewBookings = async (id: number) => {
  const comaniesIds: number[] = [];
  const activeCompanies = await supplierService.getCompanies(id);
  logger.info("activecompanies", activeCompanies.length);
  if (!activeCompanies || activeCompanies.length == 0)
    throw new BadRequestError("services dont exist");

  activeCompanies.map((item) => {
    comaniesIds.push(item.id);
  });

  const bookings = await findBookings(comaniesIds);
  if (bookings.length === 0 || !bookings) {
    logger.error("no bookings found");
    throw new BadRequestError("bookings not found");
  }
  return bookings;
};

export const verifyBooking = async (id: number, status: boolean) => {
  const bookedData = await findBookingById(id);
  if (!bookedData) throw new BadRequestError("booking not found");

  if (!status) {
    const deletedData = await deleteBooking(id);
    return deletedData;
  }

  const updatedData = await update(id, status);
  return updatedData;
};
