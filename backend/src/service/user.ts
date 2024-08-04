import { User } from "../entity/User";
import { hashPassword } from "../utils/encrypter";
import * as roleService from "./role";
import { AppDataSource } from "../dataSource";
import { UserProfile } from "../entity/UserProfile";
import { Role } from "../entity/Role";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";

export const userRepository = AppDataSource.getRepository(User);
export const userProfileRepository = AppDataSource.getRepository(UserProfile);

export const findAll = () => {
  return userRepository.find({ relations: ["profile"] });
};

export const findById = async (id: number) => {
  console.log("id reached here", id);
  const user = await userRepository.findOne({
    where: { id },
    relations: ["company", "company.ServiceToCompany"],
  });
  console.log("user found:", user);
  return user;
};

export const create = async (
  email: string,
  password: string,
  roles: Role,
  name: string,
  address: string,
  phoneNumber: string
) => {
  const newUser = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.roles = [roles];

  // Initialize the profile
  const newProfile = new UserProfile();
  newProfile.name = name;
  newProfile.address = address;
  newProfile.phoneNumber = phoneNumber;

  // Save the profile first to get an ID
  const savedProfile = await userProfileRepository.save(newProfile);
  newUser.profile = savedProfile;

  await userRepository.save(newUser);
  return newUser;
};

export const update = async (
  userId: number,
  profileId: number,
  newEmail: string,
  newName: string,
  newAddress: string,
  newPhoneNumber: string
) => {
  await userRepository.update(userId, {
    email: newEmail,
  });

  await userProfileRepository.update(profileId, {
    name: newName,
    address: newAddress,
    phoneNumber: newPhoneNumber,
  });
  return true;
};

export const remove = async (user: User) => {
  await userRepository.softRemove(user);
  return true;
};

export const findByEmail = async (email: string) => {
  return userRepository.findOneBy({ email });
};

export const findOneRolesPermisions = async (id: number) => {
  return userRepository.findOne({
    where: { id },
    relations: ["roles", "roles.permissions"],
  });
};

export const findProfile = async (id: number) => {
  return userRepository.findOne({
    where: { id },
    relations: ["profile"],
  });
};

export const getByEmail = async (email: string) => {
  const user = await findByEmail(email);
  if (!user) return null;
  return user;
};

export const getUser = async (id: number) => {
  const user = await findOneRolesPermisions(id);
  return user;
};

export const getUserProfile = async (id: number) => {
  const user = await findProfile(id);
  return user;
};

export const createUser = async (
  email: string,
  password: string,
  role: string,
  name: string,
  address: string,
  phoneNumber: string
) => {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }
  const newPassword = await hashPassword(password);
  const roleExists = await roleService.getRole(role);
  if (!roleExists) throw new NotFoundError("Role not found");

  const newUser = await create(
    email,
    newPassword,
    roleExists,
    name,
    address,
    phoneNumber
  );
  return newUser;
};

export const updateUserProfile = async (
  id: number,
  email: string,
  name: string,
  address: string,
  phoneNumber: string
) => {
  const user = await findProfile(id);
  if (!user) throw new BadRequestError("User not found");

  // Check if email is already used by another user
  const existingUser = await findByEmail(email);
  if (existingUser && existingUser.id !== id) {
    throw new BadRequestError("Email already in use");
  }

  // Update user fields
  const newEmail = email;
  let newPassword: string;
  const newName = name;
  const newAddress = address;
  const newPhoneNumber = phoneNumber;

  const profileId = user.profile.id;

  const updatedUser = await update(
    id,
    profileId,
    newEmail,
    newName,
    newAddress,
    newPhoneNumber
  );
  if (!updatedUser) return null;

  return updatedUser;
};

export const deleteUser = async (id: number) => {
  const userExists = await findById(id);

  if (!userExists) return null;

  const deletedUser = await remove(userExists);
  return deletedUser;
};

export const findUserByCompany = async (companyId: number) => {
  const user = await userRepository.findOne({
    where: {
      company: {
        id: companyId,
      },
    },
    relations: ["company", "company.ServiceToCompany"],
  });

  return user;
};

export const getAllUsers = async () => {
  const users = await findAll();
  if (!users || users.length == 0) throw new BadRequestError("users not found");
  return users;
};
