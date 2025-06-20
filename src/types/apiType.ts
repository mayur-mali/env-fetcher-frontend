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
  discription?: string;
  envFiles?: any[];
  recentActivities?: any[];
  createdAt: string;
  updatedAt: string;
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

export interface CreateGroup {
  name: string;
  description?: string;
  message?: string;
  group?: {
    id: string;
    name: string;
    admin: string;
    description?: string;
    developers: string[];
    access: string[];
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}
