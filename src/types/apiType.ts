// src/types/api.ts
export interface AuthResponse {
  message: string;
  token?: string;
}

export interface User {
  _id: string;
  email: string;
}

export interface UserResponse {
  admin: User;
}

export interface ProjectResponse {
  _id: string;
  name: string;
  admin: User;
}

export interface CreateProjectRequest {
  name: string;
  adminId: string;
}
