import { AppDataSource } from "../dataSource";
import { Category } from "../entity/Category";
import { BadRequestError } from "../error/BadRequestError";
import { CategoryCompanyQuery } from "../interface/query";
import loggerWithNameSpace from "../utils/logger";
import * as supplierServices from "./supplier";

const logger = loggerWithNameSpace("CategoryService");

const categoryRepository = AppDataSource.getRepository(Category);
const findOne = async (id: number) => {
  const category = await categoryRepository.findOne({
    where: { id },
    relations: ["services"],
  });
  return category;
};

export const getCategory = async (id: number) => {
  if (!id) throw new BadRequestError("category id is required");

  const category = await findOne(id);

  if (!category) {
    logger.error("category not found");
    throw new BadRequestError("category not found");
  }

  logger.info("category found");
  return category;
};

export const getAllCategories = async () => {
  const categories = await categoryRepository.find({ relations: ["services"] });
  if (!categories) throw new BadRequestError("categories not found");

  return categories;
};

export const companyByCategory = async (
  id: number,
  query: CategoryCompanyQuery
) => {
  const companies = await supplierServices.findCompanyByCategory(id, query);

  if (companies.data.length === 0) {
    throw new BadRequestError("companies not found");
  }

  return companies;
};
