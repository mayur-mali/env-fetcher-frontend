import axios from "./axiosInstance";
import {
  AuthResponse,
  UserResponse,
  User,
  ProjectResponse,
  CreateProjectRequest,
} from "../types/apiType";

export const registerApi = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const res = await axios.post<AuthResponse>("/api/admin/signup", {
      email,
      password,
    });
    return res.data.message || "Registration successful";
  } catch {
    return null;
  }
};

export const loginApi = async (
  email: string,
  password: string
): Promise<string> => {
  const res = await axios.post<AuthResponse>("/api/admin/login", {
    email,
    password,
  });
  if (!res.data.token) throw new Error("No token returned");
  return res.data.token;
};

export const getUserApi = async (): Promise<User> => {
  const res = await axios.get<UserResponse>("/api/admin/get-user");
  return res.data.admin;
};

export const getAllProjectsApi = async (): Promise<ProjectResponse> => {
  const res = await axios.get<ProjectResponse>("/api/project/all");
  return res.data;
};

export const createProjectApi = async (
  name: string
): Promise<CreateProjectRequest> => {
  const res = await axios.post<CreateProjectRequest>("/api/project/create", {
    name,
  });
  return res.data;
};
