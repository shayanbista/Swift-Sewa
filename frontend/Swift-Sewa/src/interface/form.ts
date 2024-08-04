export interface userForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role?: string;
}

export interface CustomFormData {
  serviceIds: string[];
  servicePrices: string[];
  photo: File | null;
  panPhoto: File | null;
  name: string;
  phoneNumber: string;
  address: string;
  location: string;
  openingTime: string;
  closingTime: string;
  categoryId: string;
}

export interface SupplierRegistrationFormData {
  serviceIds: string[];
  servicePrices: string[];
  photo: File;
  panPhoto: File;
  name: string;
  phoneNumber: string;
  address: string;
  location: string;
  description: string;
  openingTime: string;
  closingTime: string;
  categoryId: string;
  availableDays?: string;
  companyDescription: string;
  userId: string;
}
