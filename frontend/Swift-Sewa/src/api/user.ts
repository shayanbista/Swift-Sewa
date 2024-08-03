import { userForm } from "../interface/form";
import { userProfile } from "../interface/userProfile";
import { instance } from "./base";

export const userApi = {
  get: async () => {
    try {
      const response = await instance.get(`/users/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await instance.get(`/users/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
  create: async (data: userForm) => {
    try {
      const response = await instance.post("/users", data);
      return response.data;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  update: async (data: userProfile) => {
    try {
      const response = await instance.put("/users", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
