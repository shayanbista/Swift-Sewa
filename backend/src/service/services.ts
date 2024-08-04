import { getCompanies } from "./supplier";
import { In } from "typeorm";
import { AppDataSource } from "../dataSource";
import { Service } from "../entity/Service";
import loggerWithNameSpace from "../utils/logger";
import { ServiceCompanyQuery } from "../interface/query";
import * as supplierService from "./supplier";
import { BadRequestError } from "../error/BadRequestError";

const logger = loggerWithNameSpace("ServicesService");

const serviceRepository = AppDataSource.getRepository(Service);
export const findByIds = async (ids: string[]) => {
  logger.info("finding services by ids", ids);

  console.log("ids after receiving", ids);

  logger.info("finding services");

  const services = await serviceRepository.find({
    where: {
      id: In(ids),
    },
  });
  console.log("services", services);

  return services;
};

export const getAllServices = async () => {
  logger.info("finding all services");
  return await serviceRepository.find();
};

export const getServicesByIds = async (ids: string[]) => {
  console.log("ids  before passing", ids);
  const services = await findByIds(ids);

  console.log("services", services);

  if (services.length === ids.length) {
    logger.info("services found");
    return services;
  } else {
    logger.error("services not found");
    return null;
  }
};

export const getCompaniesByService = async (query: ServiceCompanyQuery) => {
  const companies = await supplierService.findCompaniesByService(query);
  if (companies.data.length === 0) {
    throw new BadRequestError("Companies don't exist");
  }

  logger.info("companies returned");
  return companies;
};
