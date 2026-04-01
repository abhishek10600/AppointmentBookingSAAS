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
  plan: "FREE" | "PRO";
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "CANCELLED";
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

export interface IAvailability {
  id: string;
  organizationId: string;
  dayofWeek: number;
  startTime: string;
  endTime: string;
}

export interface IBooking {
  id: string;
  organizationId: string;
  serviceId: string;

  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  startTime: string;
  endTime: string;

  status: "PENDING" | "CONFIRMED" | "CANCELLED";

  service?: {
    id: string;
    title: string;
  };
}
