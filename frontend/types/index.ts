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
