import { AppDataSource } from "../dataSource";
import { Category } from "../entity/Category";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("CategoryService");

const categoryRepository = AppDataSource.getRepository(Category);

export const getCategory = async (id: number) => {
  const category = await categoryRepository.findOne({ where: { id } });

  if (!category) {
    logger.error("category not found");
    return null;
  }

  logger.info("category found");
  return category;
};

export const getAllCategories = async () => {
  const categories = await categoryRepository.find({ relations: ["services"] });
  if (!categories) throw newBadRequestError("categories not found");

  return categories;
};
function newBadRequestError(arg0: string) {
  throw new Error("Function not implemented.");
}