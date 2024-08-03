import { UserProfile } from "./../entity/UserProfile";
import { User } from "../entity/User";
import { AppDataSource } from "../dataSource";
import { userRepository } from "../model/UserModel";
import { hashPassword } from "../utils/encrypter";
import { roleRepository } from "../model/RoleModel";

const userProfileRepo = AppDataSource.getRepository(UserProfile);

export async function userRolesSeed() {
  const adminRole = await roleRepository.findOne({ where: { name: "admin" } });
  if (!adminRole) {
    throw new Error("role doesnt exist");
  }

  // creating permissions
  const user = new User();
  user.email = "superadmin@gmail.com";
  user.password = await hashPassword("SuperAdmin@1*");
  user.roles = [adminRole];
  await userRepository.save(user);

  const userProfile = new UserProfile();
  userProfile.name = "SuperAdmin";
  userProfile.address = "jhamel";
  userProfile.phoneNumber = "9839218313";
  userProfile.user = user;
  await userProfileRepo.save(userProfile);
}

userRolesSeed;
