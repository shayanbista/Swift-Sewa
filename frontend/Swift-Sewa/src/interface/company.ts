import { Category } from "./category";
import { Service } from "./service";

export interface ServiceToCompany {
  id: number;
  price: string;
  description: string;
  deletedAt: null | string;
  service: Service;
}

export interface Company {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  location: string;
  description: string;
  isActive: boolean;
  photo: string;
  category: Category;
  openingTime: string;
  closingTime: string;
  panPhoto: string;
  isPending: boolean;
  deletedAt: string | null;
  ServiceToCompany: ServiceToCompany[];
}

export interface CompanyApiResponse {
  companies: Company[];
  ServiceToCompany?: ServiceToCompany[];
  data: Company[];
}
