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
  CreateGroup,
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
  const res = await axios.get<ProjectResponse>("/api/project");
  return res.data;
};

export const createProjectApi = async ({
  name,
  description,
  tags,
}: CreateProjectRequest): Promise<CreateProjectRequest> => {
  const res = await axios.post<CreateProjectRequest>("/api/project/", {
    name,
    description,
    tags,
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
  const res = await axios.post<CreateDeveloper>("/api/developer", {
    email,
    name,
    password,
  });

  if (!res.data) throw new Error("No developer created");
  return res.data;
};

export const getAllDevelopersApi = async (): Promise<CreateDeveloper[]> => {
  const res = await axios.get<CreateDeveloper[]>("/api/developer");
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

export const verifyOtpApi = async (
  email: string,
  otp: string
): Promise<string> => {
  const res = await axios.post<string>("/api/admin/verify-otp", {
    email,
    otp,
  });

  if (res.statusText !== "OK") throw new Error("OTP verification failed");
  return res.data;
};

export const createGroupApi = async ({
  name,
  description,
}: {
  name: string;
  description?: string;
}): Promise<CreateGroup> => {
  const res = await axios.post<CreateGroup>("/api/groups", {
    name,
    description,
  });

  if (!res.data) throw new Error("Group creation failed");
  return res.data;
};

export const getAllGroupsApi = async (): Promise<{ groups: any[] }> => {
  const res = await axios.get<{ groups: any[] }>("/api/groups");
  if (!res.data) throw new Error("No groups found");
  return res.data;
};

export const deleteGroupApi = async (
  groupId: string
): Promise<{ message: string }> => {
  const res = await axios.delete<{ message: string }>(`/api/groups/${groupId}`);
  if (res.status !== 200) throw new Error("Failed to delete group");
  return res.data;
};

export const logInWithGoogleApi = async (
  token: string | undefined
): Promise<AuthResponse> => {
  if (!token) throw new Error("Google token is required");

  const res = await axios.post<AuthResponse>("/api/admin/google-login", {
    token,
  });

  return res.data;
};

export const githubCallBackApi = async (
  code: string
): Promise<{ token: string }> => {
  if (!code) throw new Error("GitHub code is required");

  const res = await axios.post<{ token: string }>("/api/auth/github-exchange", {
    code,
  });

  if (res.status !== 200) throw new Error("GitHub callback failed");
  return { token: res.data.token };
};
export const logInWithGithubApi = async ({
  token,
  provider,
}: {
  token: string;
  provider: string;
}): Promise<AuthResponse> => {
  if (!token) throw new Error("GitHub token is required");

  const res = await axios.post<AuthResponse>("/api/admin/login", {
    provider,
    token,
  });

  return res.data;
};
