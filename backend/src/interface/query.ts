import { User } from './user';
import { Service } from "./../entity/Service";
export interface CategoryCompanyQuery {
  location?: string;
  page?: number;
  limit?: number;
}

export interface ServiceCompanyQuery {
  service?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface SupplierCompanyQuery {
  page?: number;
  limit?: number;
}

export interface UserQuery {
  page?: number;
  limit?: number;
}

