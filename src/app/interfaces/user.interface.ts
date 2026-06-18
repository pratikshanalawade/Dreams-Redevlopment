export type UserRole = 'admin' | 'owner' | 'renter';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  token?: string;
  phoneNumber?: string;
  propertyName?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
