import { getAllUsers } from "./../../../../backend/src/controller/admin";
import { instance } from "./base";

export const adminApi = {
  deleteUser: async (id: number) => {
    try {
      const response = await instance.delete(`/users/${id}`);
      return response.status;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
  getAllUsers: async (data: { page: number; limit: number }) => {
    try {
      const response = await instance.get(
        `/users/all?page=${data.page}&limit=${data.limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  getPendingCompanies: async () => {
    try {
      const response = await instance.get(`admin/companies/pending`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  getSelectedPendingCompnay: async (id: number) => {
    try {
      const response = await instance.get(`admin/companies/pending/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  verifyCompany: async (id: number, isAllowed: boolean) => {
    try {
      console.log("route id", id);
      const response = await instance.put(`admin/verify-company/${id}`, {
        isAllowed,
      });
      return response.status;
    } catch (err) {
      console.log("err", err);
    }
  },
};
