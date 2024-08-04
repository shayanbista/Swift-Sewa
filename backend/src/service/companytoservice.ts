import { Like, QueryBuilder } from "typeorm";
import { AppDataSource } from "../dataSource";
import { ServiceToCompany } from "../entity/Company_Service";
import { ServiceCompanyQuery } from "../interface/query";

const companyToServiceRepository =
  AppDataSource.getRepository(ServiceToCompany);

export const deleteCompanyService = async (ids: {
  userId: number;
  companyId: number;
  serviceId: number;
}) => {
  return await companyToServiceRepository
    .createQueryBuilder()
    .delete()
    .from(ServiceToCompany)
    .where("company_id = :companyId", { companyId: ids.companyId })
    .andWhere("service_id = :serviceId", { serviceId: ids.serviceId })
    .execute();
    
};

export const findByService = async (query: ServiceCompanyQuery) => {
  const queryLocation = query.location?.trim();

  const [result, total] = await companyToServiceRepository.findAndCount({
    where: {
      service: {
        name: query.service,
      },
      company: {
        location: queryLocation,
      },
    },
    relations: ["company"],
    skip: (query.page! - 1) * query.limit!,
    take: query.limit,
  });

  return {
    data: result,
    totalPages: Math.ceil(total / query.limit!),
    currentPage: query.page,
    pageSize: query.limit,
    totalItems: total,
  };
};

export const companyServiceExists = async (id: number, companyId: number) => {
  return await companyToServiceRepository.findOne({
    where: {
      id,
      company: {
        id: companyId,
      },
    },
  });
};
