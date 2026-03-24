export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IOrganization {
  id: string;
  name: string;
  slug: string;
  timezone: string;
}

export interface IService {
  id: string;
  title: string;
  description: string;
  serviceType: "ONLINE" | "OFFLINE";
  durationInMinutes: number;
  price: number;
  currency: string;
  locationAddress?: string;
  isActive: boolean;
}
