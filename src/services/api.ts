import axios from "./axiosInstance";
import {
  AuthResponse,
  UserResponse,
  User,
  ProjectResponse,
  CreateProjectRequest,
  UploadEnvFile,
  CreateDeveloper,
  GenerateProjectToken,
} from "../types/apiType";

export const registerApi = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<string | null> => {
  try {
    const res = await axios.post<AuthResponse>("/api/admin/register", {
      email,
      password,
      firstName,
      lastName,
    });
    return res.data.message || "Registration successful";
  } catch {
    return null;
  }
};

export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>("/api/admin/login", {
    email,
    password,
  });

  if (res.statusText !== "OK") throw new Error("No token returned");
  return res.data;
};

export const getUserApi = async (): Promise<User> => {
  const res = await axios.get<UserResponse>("/api/admin/me");
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

export const uploadEnvironmentFileApi = async ({
  projectId,
  envType,
  envFile,
}: UploadEnvFile): Promise<UploadEnvFile> => {
  const formData = new FormData();
  formData.append("projectId", projectId);
  formData.append("envType", envType);
  formData.append("file", envFile);

  const res = await axios.post<UploadEnvFile>("/api/env/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res.data) throw new Error("No file uploaded");
  return res.data;
};

export const createDeveloperApi = async ({
  email,
  name,
  password,
}: CreateDeveloper): Promise<CreateDeveloper> => {
  const res = await axios.post<CreateDeveloper>("/api/admin/create-developer", {
    email,
    name,
    password,
  });

  if (!res.data) throw new Error("No developer created");
  return res.data;
};

export const getAllDevelopersApi = async (): Promise<CreateDeveloper[]> => {
  const res = await axios.get<CreateDeveloper[]>("/api/developer/all");
  return res.data;
};

export const generateProjectToken = async ({
  projectId,
  envType,
}: GenerateProjectToken): Promise<GenerateProjectToken> => {
  const res = await axios.post<GenerateProjectToken>(
    "api/project/generate-token",
    {
      projectId,
      envType,
    }
  );
  return res.data;
};

export const getAllActivitiesApi = async (): Promise<[]> => {
  const res = await axios.get<[]>("/api/activity");
  if (!res.data) throw new Error("No activities found");
  return res.data;
};

export const getDashboardStatsApi = async (): Promise<{}> => {
  const res = await axios.get<{}>("/api/activity/dashboard/stats");
  if (!res.data) throw new Error("No dashboard stats found");
  return res.data;
};
