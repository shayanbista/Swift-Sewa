import { Router } from "express";
import { getAllCategories, getCompanyByCategory } from "../controller/category";
import { getCategory } from "../controller/category";
import { authenticate } from "../middleware/auth";

const categoryRouter = Router();

categoryRouter.get("/", authenticate, getAllCategories);

categoryRouter.get("/:id", authenticate, getCategory);

categoryRouter.get("/:id/companies", authenticate, getCompanyByCategory);

export default categoryRouter;
