import axiosInstance from "../lib/axios";
import {
  RakResponse,
  RakResponseDetail,
  CreateBudget,
  CreateBudgetDetail,
  UpdateRak,
  RakResponseSingle,
} from "types/rak";

export const getRakByBranch = async (
  branchId: number
): Promise<RakResponse> => {
  const response = await axiosInstance.get("/rak-summary/" + branchId);
  return response.data;
};

export const getRakById = async (id: number): Promise<RakResponseDetail> => {
  const response = await axiosInstance.get("/rak/" + id);
  return response.data;
};

export const getRakAll = async (): Promise<RakResponse> => {
  const response = await axiosInstance.get("/rak");
  return response.data;
};

export const updateRakStatus = async (
  id: number,
  status: string,
  revision_note?: string
): Promise<any> => {
  const payload: any = { status };
  if (revision_note) {
    payload.revision_note = revision_note;
  }
  const response = await axiosInstance.patch("/rak-status/" + id, payload);
  return response.data;
};

export const storeBudget = async (
  data: CreateBudget
): Promise<RakResponseSingle> => {
  const response = await axiosInstance.post("/budget", data);
  return response.data;
};

export const storeBudgetDetail = async (
  data: CreateBudgetDetail
): Promise<RakResponseDetail> => {
  const response = await axiosInstance.post("/budget-detail", data);
  return response.data;
};

export const deleteRakByBranch = async (id: number): Promise<void> => {
  const response = await axiosInstance.delete("/rak/" + id);
  return response.data;
};

export const deleteRak = async (id: number): Promise<void> => {
  const response = await axiosInstance.delete("/budget/" + id);
  return response.data;
};
