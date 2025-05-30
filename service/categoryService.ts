import axiosInstance from "../lib/axios";
import { Category, BaseCategory } from "types/category";

export const getCategories = async () => {
  const response = await axiosInstance.get("/category");
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await axiosInstance.get<{ data: Category }>(
    `/category/${id}`
  );
  return response.data.data;
};

export const createCategory = async (data: BaseCategory): Promise<Category> => {
  const response = await axiosInstance.post<{ data: Category }>(
    "/category",
    data
  );
  return response.data.data;
};

export const updatecategory = async (
  id: number,
  data: BaseCategory
): Promise<Category> => {
  const response = await axiosInstance.put<{ data: Category }>(
    `/category/${id}`,
    data
  );
  return response.data.data;
};

export const deletecategory = async (id: number): Promise<void> => {
  const response = await axiosInstance.delete(`/category/${id}`);
  return response.data;
};
