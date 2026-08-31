// src/app/core/models/auth.model.ts

import { User } from './user.model';

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface LoginResponse {
  accessToken:  string;
  refreshToken: string;
  type:         string;
  expiresIn:    number;
  user:         User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}