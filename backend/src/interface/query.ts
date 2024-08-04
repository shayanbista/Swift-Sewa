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
