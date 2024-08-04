import { Service } from "./service";

export interface Category {
  id: string;
  name: string;
  description: string;
  services: Service[];
}
