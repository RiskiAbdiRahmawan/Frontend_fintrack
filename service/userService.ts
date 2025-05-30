// src/services/userData.ts
import axiosInstance from "lib/axios";
import { User, CreateUser, UpdateUser, UserResponse } from "types/user";

export const getUsers = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get("/user");
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axiosInstance.get<{ data: User }>(`/user/${id}`);
  return response.data.data;
};

export const createUser = async (data: CreateUser): Promise<User> => {
  const response = await axiosInstance.post<{ data: User }>("/user", data);
  return response.data.data;
};

export const updateUser = async (
  id: number,
  data: UpdateUser
): Promise<User> => {
  const payload: Partial<UpdateUser> = {
    name: data.name,
    email: data.email,
    branch_id: data.branch_id,
    role: data.role,
  };

  if (data.password && data.password.trim() !== "") {
    payload.password = data.password;
  }

  const response = await axiosInstance.put<{ data: User }>(
    `/user/${id}`,
    payload
  );
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await axiosInstance.delete(`/user/${id}`);
  return response.data;
};
