import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middleware/validator";
import uploader from "../middleware/fileupload";

import {
  deleteCompanies,
  deleteSelectedcompanyService,
  getSpecificCompany,
  getSuppliersCompanies,
  registerCompany,
} from "../controller/supplier";
import {
  companyBodySchema,
  companyIdSchema,
  companyupdateSchema,
} from "../schema/supplier";
import { updateCompany } from "../controller/supplier";

const supplierRouter = Router();

supplierRouter.post(
  "/",
  authenticate,
  authorize("company.post"),
  uploader.fields([
    { name: "photo", maxCount: 1 },
    { name: "pan-photo", maxCount: 1 },
  ]),
  validateReqBody(companyBodySchema),
  registerCompany
);

supplierRouter.put(
  "/:id",
  authenticate,
  authorize("company.put"),

  validateReqParams(companyIdSchema),
  uploader.fields([{ name: "photo", maxCount: 1 }]),
  validateReqBody(companyupdateSchema),
  updateCompany
);

supplierRouter.get(
  "/companies",
  authenticate,
  authorize("company.get"),
  getSuppliersCompanies
);

supplierRouter.get(
  "/companies/:id",
  authenticate,
  authorize("company.get"),
  validateReqParams(companyIdSchema),
  getSpecificCompany
);

supplierRouter.delete(
  "/company-service",
  authenticate,
  authorize("company.delete"),
  deleteSelectedcompanyService
);

supplierRouter.delete(
  "/:id",
  authenticate,
  authorize("company.get"),
  validateReqParams(companyIdSchema),
  deleteCompanies
);

export default supplierRouter;
