import { userForm } from "../interface/form";
import { instance } from "./base";

export const authApi = {
  login: async (data: Pick<userForm, "email" | "password">) => {
    try {
      const response = await instance.post("/auth/login", data);
      return response.data;
    } catch (err) {
      throw err;
    }
  },



  
};
