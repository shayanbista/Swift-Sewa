import { SupplierRegistrationFormData } from "../interface/form";
import { instance } from "./base";
let categoryId = localStorage.getItem("categoryId");
let companyId = localStorage.getItem("companyId");

export const supplierApi = {
  getAll: async (data: { page: number; limit: number }) => {
    try {
      const response = await instance.get(
        `/suppliers/companies?page=${data.page}&limit=${data.limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  getOne: async (id: number) => {
    try {
      const response = await instance.get(`/suppliers/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  post: async (data: FormData) => {
    try {
      const response = await instance.post(`/suppliers`, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  put: async (data: FormData) => {
    try {
      const response = await instance.put(`/suppliers/${companyId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  deleteCompanyService: async (data: number[]) => {
    try {
      const response = await instance.delete(`/suppliers/company-service/`, {
        data: data,
      });
      return response.status;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
};
