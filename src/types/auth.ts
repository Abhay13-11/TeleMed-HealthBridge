export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  specialization?: string; // for doctors
  location?: string; // for patients and pharmacies
  phone?: string;
}

export interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role?: UserRole; phone?: string; location?: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
