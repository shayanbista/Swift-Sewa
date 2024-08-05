import * as supplierService from "./supplier";
import loggerWithNameSpace from "../utils/logger";
import { BadRequestError } from "../error/BadRequestError";
import * as userService from "./user";
import { UserQuery } from "../interface/query";

const logger = loggerWithNameSpace("AdminService");

export const getAllPendingCompanies = async () => {
  logger.info("fetching all pending companies");

  const companies = await supplierService.pendingCompanies();

  if (!companies || companies.length === 0)
    throw new BadRequestError("no pending companies exists at the moment");
  return companies;
};

export const getPendingCompanyById = async (companyId: number) => {
  const company = await supplierService.findSelectedPendingCompany(companyId);
  if (!company)
    throw new BadRequestError(
      "the company doesnt exist or has been verified already"
    );
  return company;
};

export const verifyCompany = async (companyId: number, isAllowed: boolean) => {
  const company = await supplierService.findSelectedPendingCompany(companyId);

  if (!company)
    throw new BadRequestError(
      "the company doesnt exist or has been verified already"
    );

  if (!company.isPending) throw new BadRequestError("company already verified");

  const UserId = company.user.id;

  if (!isAllowed) {
    logger.info("company is rejected");
    await supplierService.deleteRejectedCompany(companyId, UserId);
    return { message: "the company has been rejected" };
  } else {
    logger.info("company is approved");
    await supplierService.updatePendingStatus(companyId, isAllowed);
    return { message: "the company has been approved" };
  }
};

export const getUsers = async (query: UserQuery) => {
  const users = await userService.getAllUsers(query);
  if (!users || users.data.length === 0)
    throw new BadRequestError("no users found");
  return users;
};

export const getSelectedUser = async (userId: number) => {
  const selectedUser = await userService.getUserProfile(userId);
  if (!selectedUser) throw new BadRequestError("user not found");
  return selectedUser;
};

export const deleteUser = async (userId: number) => {
  const deletedUser = await userService.deleteUser(userId);
  return deletedUser;
};
