export interface AuthResponse {
  message?: string;
  token?: string | null | undefined;
  admin?: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserResponse {
  admin: User;
}

export interface ProjectResponse {
  _id: string;
  name: string;
  admin: User;
  isDelete: boolean;
  tags: string[];
  description?: string;
  envFiles?: any[];
  recentActivities?: any[];
  createdAt: string;
  updatedAt: string;
  status?: string | undefined;
}

export interface CreateProjectRequest {
  name: string;
  adminId?: string;
  description?: string;
  tags?: string[];
  status?: string;
}

export interface UploadEnvFile {
  projectId: string;
  envType: string;
  envFile: string | Blob;
  message?: string;
}

export interface CreateDeveloper {
  email: string;
  name: string;
  password: string;
  _id?: string;
}

export type Environment = "development" | "staging" | "production";

interface CreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
}
interface Project {
  id: string;
  name?: string;
}
export interface Token {
  _id?: string;
  name?: string;
  token?: string;
  createdBy?: CreatedBy;
  projectId?: Project;
  envType: Environment | string | undefined;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}

export interface Group {
  id: string;
  name: string;
  admin: string;
  description?: string;
  developers: string[];
  access: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroup {
  name: string;
  description?: string;
  message?: string;
  group?: Group;
}

export interface Access {
  projectId: string;
  envType: Environment | string | undefined;
}
