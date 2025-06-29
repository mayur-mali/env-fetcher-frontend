import axios from "./axiosInstance";
import {
  AuthResponse,
  UserResponse,
  User,
  ProjectResponse,
  CreateProjectRequest,
  UploadEnvFile,
  CreateDeveloper,
  CreateGroup,
  Token,
  Group,
  Access,
} from "../types/apiType";
import { DashboardState } from "src/pages/Dashboard";

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

export const getAllProjectsApi = async (): Promise<
  ProjectResponse[] | null
> => {
  const res = await axios.get<ProjectResponse[]>("/api/project");
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

export const updateProjectApi = async ({
  projectId,
  name,
  description,
  tags,
  status,
  isDeleted,
}: {
  projectId: string;
  name?: string;
  description?: string;
  tags?: string[];
  status?: string;
  isDeleted?: boolean;
}) => {
  const res = await axios.put(`/api/project/${projectId}`, {
    name,
    description,
    tags,
    status,
    isDeleted,
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
export const updateDeveloperApi = async ({
  developerId,

  name,
  isActive,
}: {
  developerId: string;

  name?: string;
  isActive?: boolean;
}): Promise<CreateDeveloper> => {
  const res = await axios.put<CreateDeveloper>(
    `/api/developer/${developerId}`,
    {
      name,
      isActive,
    }
  );

  if (!res.data) throw new Error("No developer updated");
  return res.data;
};
export const deleteDeveloperApi = async (
  developerId: string
): Promise<string> => {
  const res = await axios.delete<string>(`/api/developer/${developerId}`);
  if (res.status !== 200) throw new Error("Failed to delete developer");
  return res.data;
};

export const generateProjectToken = async ({
  projectId,
  envType,
  description,
}: {
  projectId: string | undefined | null;
  envType: string | undefined | null;
  description?: string;
}): Promise<Token> => {
  const res = await axios.post<Token>("api/token", {
    projectId,
    envType,
    description,
  });
  return res.data;
};

export const getAllTokensApi = async (): Promise<Token[]> => {
  const res = await axios.get<Token[]>("/api/token");
  if (!res.data) throw new Error("No tokens found");
  return res.data;
};
export const deactivateTokenApi = async (tokenId: string): Promise<string> => {
  const res = await axios.put<string>(`/api/token/${tokenId}/deactivate`);
  if (res.status !== 200) throw new Error("Failed to delete token");
  return res.data;
};

export const getAllActivitiesApi = async (): Promise<[]> => {
  const res = await axios.get<[]>("/api/activity");
  if (!res.data) throw new Error("No activities found");
  return res.data;
};

export const getDashboardStatsApi = async (): Promise<DashboardState> => {
  const res = await axios.get<DashboardState>("/api/dashboard/stats");
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

export const getAllGroupsApi = async (): Promise<Group[]> => {
  const res = await axios.get<Group[]>("/api/groups");
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
export const logInWithAuth = async ({
  token,
  provider,
  email,
  password,
}: {
  token?: string;
  provider?: string;
  email?: string;
  password?: string;
}): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>("/api/admin/login", {
    email,
    password,
    provider,
    token,
  });

  return res.data;
};

export const compareEvnVersionsApi = async ({
  projectId,
  envType,
  version1,
  version2,
}: {
  projectId: string;
  envType: string;
  version1: string;
  version2: string;
}): Promise<{
  result: { left: string; right: string; change: "added" | "removed" }[];
}> => {
  const res = await axios.get<{
    result: { left: string; right: string; change: "added" | "removed" }[];
  }>(`/api/env/compare/${projectId}/${envType}/${version1}/${version2}`);
  if (!res.data) throw new Error("No changes found");
  return res.data;
};

export const assignDevelopersToGroupApi = async ({
  groupId,
  developerIds,
}: {
  groupId: string;
  developerIds: string[];
}): Promise<{ message: string }> => {
  const res = await axios.put<{ message: string }>(
    `/api/groups/${groupId}/assign`,
    { developerIds }
  );

  if (res.status !== 200) throw new Error("Failed to assign developers");
  return res.data;
};

export const updateAccessOfGroup = async ({
  groupId,
  access,
}: {
  groupId: string;
  access: Access[];
}): Promise<{ message: string }> => {
  const res = await axios.put<{ message: string }>(
    `api/groups/${groupId}/access`,
    { access }
  );

  if (res.status !== 200) throw new Error("Failed to update access");
  return res.data;
};
