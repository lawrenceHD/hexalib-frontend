import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  user: User;
}

export interface RegisterRequest {
  nomComplet: string;
  email: string;
  password: string;
  role: string;
}