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
import { SupplierCompanyQuery } from "../interface/query";
import { string } from "joi";

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

// const findBookings = async (companyIds: number[]) => {
//   const bookings = await bookRepository.find({
//     where: {
//       company: {
//         id: In(companyIds),
//       },
//       isApproved: false,
//     },
//     relations: ["company", "serviceToCompany.service"],
//   });
//   return bookings;
// };

export const findBookings = async (
  companyIds: number[],
  query: SupplierCompanyQuery
) => {
  const { page, limit } = query;
  const offset = (page! - 1) * limit!;

  const [bookings, total] = await bookRepository.findAndCount({
    where: { company: { id: In(companyIds) } },
    relations: ["serviceToCompany", "serviceToCompany.service"],
    skip: offset,
    take: limit,
  });

  return {
    data: bookings,
    totalPages: Math.ceil(total / limit!),
    currentPage: page,
    pageSize: limit,
    totalItems: total,
  };
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

export const viewBookings = async (id: number, query: SupplierCompanyQuery) => {
  const comaniesIds: number[] = [];
  const query1: SupplierCompanyQuery = { ...query, limit: -1 };

  const activeCompanies = await supplierService.getCompanies(id, query1);

  logger.info("activecompanies", activeCompanies.totalPages);

  if (!activeCompanies || activeCompanies.data.length == 0)
    throw new BadRequestError("services dont exist");

  activeCompanies.data.map((item) => {
    comaniesIds.push(item.id);
  });

  const bookings = await findBookings(comaniesIds, query);
  if (bookings.data.length === 0 || !bookings) {
    logger.error("no bookings found");
    throw new BadRequestError("bookings not found");
  }

  return bookings;
};

export const verifyUserBooking = async (id: number, status: boolean) => {
  console.log("id", id);
  const bookedData = await findBookingById(id);
  console.log("bookedData", bookedData);

  if (!bookedData) throw new BadRequestError("booking not found");

  if (!status) {
    const deletedData = await deleteBooking(id);
    return deletedData;
  }

  const updatedData = await update(id, status);
  return updatedData;
};
