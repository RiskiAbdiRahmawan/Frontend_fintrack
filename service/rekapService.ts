import axiosInstance from "../lib/axios";
import { RekapType } from "types/rekap";

export const getAllRekap = async (): Promise<RekapType[]> => {
  const response = await axiosInstance.get("/rekaptulasi");
  return response.data.data as RekapType[];
};

export const getRekapByBranch = async (id: number): Promise<RekapType[]> => {
  const response = await axiosInstance.get("/rekaptulasi/" + id);
  return response.data.data as RekapType[];
};
