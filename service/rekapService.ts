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

export const handleExportExcel = async (
  setExportState: (val: { status: string }) => void
) => {
  try {
    setExportState({ status: "exporting_excel" });

    const branchId =
      typeof window !== "undefined" ? localStorage.getItem("branch_id") : null;

    if (!branchId) {
      alert("Branch ID tidak ditemukan di localStorage.");
      setExportState({ status: "idle" });
      return;
    }

    const response = await axiosInstance.get(
      `/rekaptulasi/export/excel/${branchId}`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rekapitulasi-${branchId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Gagal download Excel:", error);
    alert("Terjadi kesalahan saat mengekspor Excel.");
  } finally {
    setExportState({ status: "idle" });
  }
};
