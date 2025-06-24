// dashboard/data/transaksiData.ts
import axiosInstance from "../../lib/axios";

export interface Transaksi {
  tipe: "Pemasukan" | "Pengeluaran";
  jumlah: number;
  tanggal: string;
}

export interface DashboardSummary {
  pemasukan: number;
  pengeluaran: number;
  total_anggaran: number;
  realisasi_anggaran: number;
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await axiosInstance.get(
    "/dashboard-summary/" + Number(localStorage.getItem("branch_id"))
  );

  if (!res.data) {
    throw new Error("Failed to fetch dashboard summary");
  }

  return res.data;
}

export interface TrendChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface TrendChartData {
  labels: string[];
  datasets: TrendChartDataset[];
}

export async function fetchTrendChartData(): Promise<TrendChartData | null> {
  try {
    const res = await axiosInstance.get(
      "/dashboard-trendchart/" + Number(localStorage.getItem("branch_id"))
    );
    if (!res.data) throw new Error("Failed to fetch trend chart data");
    return res.data;
  } catch (error) {
    console.error("Error fetching trend chart data:", error);
    return null;
  }
}

export interface TrendYearData {
  year: string;
  total: number;
}

export const fetchTrendChartYearly = async (): Promise<TrendYearData[]> => {
  try {
    const res = await axiosInstance.get(
      "/dashboard-trendchart-yearly/" +
        Number(localStorage.getItem("branch_id"))
    );
    if (!res.data) throw new Error("Failed to fetch trend chart yearly data");

    return res.data;
  } catch (error) {
    console.error("Error fetching yearly trend chart data:", error);
    throw new Error("Failed to fetch yearly trend chart data");
  }
};

export interface TransaksiItem {
  tipe: string;
  jumlah: number;
  tanggal: string;
}

export async function fetchRecentTransactions(): Promise<TransaksiItem[]> {
  try {
    const res = await axiosInstance.get(
      "/dashboard-transactions/" + Number(localStorage.getItem("branch_id"))
    );
    if (!res.data) {
      throw new Error("Failed to fetch recent transactions");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return [];
  }
}
