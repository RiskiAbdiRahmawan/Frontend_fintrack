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
  setExportState: (val: { status: string }) => void,
  branchId?: string
) => {
  try {
    setExportState({ status: "exporting_excel" });

    const selectedBranchId = branchId;

    if (!selectedBranchId) {
      alert("Branch ID tidak ditemukan di localStorage.");
      setExportState({ status: "idle" });
      return;
    }

    const response = await axiosInstance.get(
      `/rekapitulasi/export/excel/${selectedBranchId}`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rekapitulasi-${selectedBranchId}.xlsx`);
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

export const handleExportPDF = async (
  setExportState: (val: { status: string }) => void,
  branchId?: string
) => {
  try {
    setExportState({ status: "exporting_pdf" });

    const selectedBranchId = branchId;

    if (!selectedBranchId) {
      alert("Branch ID tidak ditemukan di localStorage.");
      setExportState({ status: "idle" });
      return;
    }

    const response = await axiosInstance.get(
      `/rekapitulasi/export/pdf/${selectedBranchId}`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `laporan-keuangan-lengkap-${selectedBranchId}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal download PDF:", error);
    alert("Terjadi kesalahan saat mengekspor PDF.");
  } finally {
    setExportState({ status: "idle" });
  }
};
