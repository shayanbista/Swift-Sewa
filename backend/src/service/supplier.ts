import { Service } from "./../entity/Service";
import { AppDataSource } from "../dataSource";
import { companyData } from "../interface/company";
import * as services from "./services";
import { BadRequestError } from "../error/BadRequestError";
import { getCategory } from "./category";
import { Company } from "../entity/Company";
import { User } from "../entity/User";
import { Category } from "../entity/Category";
import { uploadStream } from "../cloudinary";
import { ServiceToCompany } from "../entity/Company_Service";
import loggerWithNameSpace from "../utils/logger";
import { uploadSingleImage } from "../utils/fileUploader";
import { deleteCompanyService } from "./companytoservice";
import { CategoryCompanyQuery, ServiceCompanyQuery } from "../interface/query";

import { findByService } from "./companytoservice";

const logger = loggerWithNameSpace("SupplierService");

const companyRepository = AppDataSource.getRepository(Company);
const companyServiceRepository = AppDataSource.getRepository(ServiceToCompany);

const update = async (
  company: Company,
  data: Partial<companyData>,
  newImage: { imageUrl: string }
): Promise<Partial<Company>> => {
  const companyUpdateData: Partial<Company> = {
    ...(data.name && { name: data.name }),
    ...(data.address && { address: data.address }),
    ...(data.location && { location: data.location }),
    ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
    ...(data.openingTime && { openingTime: data.openingTime }),
    ...(data.closingTime && { closingTime: data.closingTime }),
    ...(data.isActive !== undefined && { isActive: data.isActive }),
    ...((newImage !== undefined || !newImage) && { photo: newImage.imageUrl }),
  };

  await companyRepository.update(company.id, companyUpdateData);

  await companyServiceRepository.delete({ company });

  const promises = data.serviceIds!.map(async (item, index) => {
    const companyService = new ServiceToCompany();
    companyService.description = data.description![index];
    companyService.price = data.price![index];
    companyService.company = company;
    companyService.service = item as unknown as Service;
    await companyServiceRepository.save(companyService);
  });

  await Promise.all(promises);
  return companyUpdateData;
};

export const createCompany = async (
  data: companyData,
  imageurl: { [key: string]: string },
  services: Service[]
) => {
  const newCompany = new Company();

  newCompany.name = data.name;
  newCompany.address = data.address;
  newCompany.location = data.location;
  newCompany.phoneNumber = data.phoneNumber;
  newCompany.isActive = true;
  newCompany.isPending = true;
  newCompany.user = data.userId as unknown as User;
  newCompany.category = data.categoryId as unknown as Category;
  newCompany.photo = imageurl.companyImageUrl;
  newCompany.panPhoto = imageurl.panImageUrl;
  newCompany.openingTime = data.openingTime;
  newCompany.closingTime = data.closingTime;
  newCompany.description = data.companyDescription;
  await companyRepository.save(newCompany);

  const promises = services.map(async (item, index) => {
    const comapnyService = new ServiceToCompany();
    comapnyService.description = item.description;
    comapnyService.price = data.price[index];
    comapnyService.company = newCompany;
    comapnyService.service = item;
    await companyServiceRepository.save(comapnyService);
  });
  logger.info(" new company created");
  return await Promise.all(promises);
};

const remove = async (company: Company) => {
  return await companyRepository.softRemove(company);
};
export const findByName = async (name: string) => {
  logger.info(" finding company by name");
  return await companyRepository.findOne({ where: { name, isPending: false } });
};

export const pendingCompanies = async () => {
  return await companyRepository.find({ where: { isPending: true } });
};

export const findRejectedCompany = async (id: number) => {
  logger.info(" finding company by Id");
  return await companyRepository.findOne({
    where: {
      id,
    },
    relations: ["ServiceToCompany"],
  });
};

export const findSelectedPendingCompany = async (id: number) => {
  logger.info(" finding company by Id");
  return await companyRepository.findOne({
    where: {
      id,
      isPending: true,
    },
    relations: [
      "user",
      "ServiceToCompany",
      "category",
      "ServiceToCompany.service",
    ],
  });
};

export const updatePendingStatus = async (id: number, status: boolean) => {
  return await companyRepository.update(id, { isPending: !status });
};

export const findByCompanyId = async (id: number, userId: number) => {
  logger.info(" finding company by Id");
  return await companyRepository.findOne({
    where: {
      id,
    },
    relations: ["ServiceToCompany", "category", "ServiceToCompany.service"],
  });
};

export const findAll = async (userId: number) => {
  return await companyRepository.find({ where: { user: { id: userId } } });
};

const findByCategory = async (id: number, query: CategoryCompanyQuery) => {
  const [result, total] = await companyRepository.findAndCount({
    where: {
      category: {
        id,
      },
      location: query.location,
    },
    skip: (query.page! - 1) * query.limit!,
    take: query.limit!,
  });

  return {
    data: result,
    totalPages: Math.ceil(total / query.limit!),
    currentPage: query.page,
    pageSize: query.limit,
    totalItems: total,
  };
};

export const uploadCompanyImages = async (imageFiles: {
  [key: string]: Express.Multer.File[];
}) => {
  const firstKey = Object.keys(imageFiles)[0];
  const companyPhoto = imageFiles[firstKey][0];
  const secondKey = Object.keys(imageFiles)[1];
  const panPhoto = imageFiles[secondKey][0];

  const companyImageResult = await uploadStream(
    companyPhoto.buffer,
    "company-images",
    companyPhoto.originalname
  );
  const companyImageUrl = companyImageResult.secure_url;

  const panImageResult = await uploadStream(
    panPhoto.buffer,
    "pan-images",
    panPhoto.originalname
  );
  const panImageUrl = panImageResult.secure_url;

  logger.info("uploaded image to cloudinary");
  return { companyImageUrl, panImageUrl };
};

export const registerCompany = async (
  data: companyData,
  imageFiles: {
    [key: string]: Express.Multer.File[];
  },
  id: number
) => {
  // const uploadFormImages = await uploadImage(imageFiles);
  const uploadFormImages = await uploadCompanyImages(imageFiles);

  const category = await getCategory(Number(data.categoryId));
  if (!category) throw new BadRequestError("category not found");

  const companyServices = await services.getServicesByIds(data.serviceIds);

  if (!companyServices) throw new BadRequestError("services not found");

  const companyexisits = await findByName(data.name);
  if (companyexisits) throw new BadRequestError("company already exists ");
  data.userId = String(id);

  const newCompany = await createCompany(
    data,
    uploadFormImages,
    companyServices
  );

  if (!newCompany) throw new BadRequestError("company not created");

  return newCompany;
};

const deletecompanyService = async (ids: {
  userId: number;
  companyId: number;
  serviceId: number;
}) => {
  const deletedCompany = await deleteCompanyService(ids);
  if (!deletedCompany) {
    logger.error("company not deleted");
    throw new BadRequestError("company not deleted");
  }
  return deleteCompany;
};

export const getCompanies = async (id: number) => {
  const activeCompanies: Company[] = [];
  if (!id) throw new BadRequestError("user not found");
  const companies = await findAll(id);

  if (companies.length === 0) throw new BadRequestError("companies dont exist");

  companies.forEach((company) => {
    if (company.isPending == false) {
      activeCompanies.push(company);
    }
  });

  if (activeCompanies.length === 0) {
    throw new BadRequestError(
      "the company has not been verified by admin please try again later"
    );
  }

  return activeCompanies;
};

export const getCompany = async (id: number, userId: number) => {
  const company = await findByCompanyId(id, userId);
  if (!company) throw new BadRequestError("not found");
  return company;
};

export const updateCompany = async (
  id: number,
  data: Partial<companyData>,
  imageFiles: { [key: string]: Express.Multer.File[] },
  userId: string
) => {
  const company = await findByCompanyId(id, Number(userId));
  if (!company) throw new BadRequestError("company to update not found");

  const newImage =
    imageFiles !== undefined
      ? await uploadSingleImage(imageFiles)
      : { imageUrl: company.photo };

  const companyServices = await services.getServicesByIds(data.serviceIds!);
  if (!companyServices) throw new BadRequestError("services not found");

  if (data.name && data.name !== company.name) {
    const existingCompany = await findByName(data.name);
    if (existingCompany) throw new BadRequestError("Company already exists");
  }

  const updatedCompany = await update(company, data, newImage);
};

export const deleteCompany = async (id: number, userId: number) => {
  if (!userId) throw new BadRequestError("user not found");

  const companyExists = await findByCompanyId(id, userId);

  if (!companyExists) throw new BadRequestError("company doesnt exist");

  const deletedCompany = await remove(companyExists);
  return deletedCompany;
};

export const deleteSelectedcompanyService = async (ids: {
  userId: number;
  companyId: number;
  serviceId: number;
}) => {
  if (!ids.userId) throw new BadRequestError("user not found");
  const deletedService = await deleteCompanyService(ids);
  return deletedService;
};

export const findCompanyByCategory = async (
  categoryId: number,
  query: CategoryCompanyQuery
) => {
  const companies = await findByCategory(categoryId, query);
  return companies;
};

export const findCompaniesByService = async (query: ServiceCompanyQuery) => {
  const companies = await findByService(query);
  return companies;
};

export const deleteRejectedCompany = async (id: number, userId: number) => {
  if (!userId) throw new BadRequestError("user not found");

  const companyExists = await findRejectedCompany(id);

  if (!companyExists) throw new BadRequestError("company doesnt exist");

  const deletedCompany = await remove(companyExists);
  return deletedCompany;
};
