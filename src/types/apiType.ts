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
  envFiles?: any[];
  recentActivities?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  adminId: string;
}

export interface UploadEnvFile {
  projectId: string;
  envType: string;
  envFile: string | Blob;
}

export interface CreateDeveloper {
  email: string;
  name: string;
  password: string;
}

export interface GenerateProjectToken {
  projectId: string;
  envType: string | undefined;
  token?: string | undefined;
}
