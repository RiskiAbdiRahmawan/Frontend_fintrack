// src/data/dashboardData.ts
import axiosInstance from "../../lib/axios";

// src/utils/superadmin/dashboardData.ts

const formatRupiah = (value: number | string): string => {
  const number = Math.floor(Number(value)); // Buang desimal
  return `Rp. ${number.toLocaleString("id-ID")},00`;
};

export type BranchData = {
  branch_code: string;
  branch_name: string;
  branch_address: string;
  pemasukan: number;
  pengeluaran: number;
  total_anggaran: number;
  realisasi_anggaran: number;
};

export type DashboardSummaryResponse = {
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    total_anggaran: number;
    total_realisasi_anggaran: number;
    jumlah_cabang: number;
  };
  branches: BranchData[];
};

export type cardSummaryData = {
  title: string;
  value: string;
  iconName: string;
  iconColorClass: string;
  bgColorClass: string;
};

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  try {
    const res = await axiosInstance.get("/superadmin/dashboard-summary");
    return res.data;
  } catch (error) {
    console.error("Gagal fetch dashboard summary:", error);
    throw error;
  }
}

export function createCardSummaryData(
  selectedBranch: string,
  dashboardData: DashboardSummaryResponse
): cardSummaryData[] {
  let data;

  if (selectedBranch === "all") {
    // Tampilkan data summary keseluruhan
    data = {
      pemasukan: dashboardData.summary.total_pemasukan,
      pengeluaran: dashboardData.summary.total_pengeluaran,
      total_anggaran: dashboardData.summary.total_anggaran,
      realisasi_anggaran: dashboardData.summary.total_realisasi_anggaran,
    };
  } else {
    // Tampilkan data branch yang dipilih
    const branch = dashboardData.branches.find(
      (b) => b.branch_code === selectedBranch
    );
    if (!branch) {
      throw new Error("Branch not found");
    }
    data = {
      pemasukan: branch.pemasukan,
      pengeluaran: branch.pengeluaran,
      total_anggaran: branch.total_anggaran,
      realisasi_anggaran: branch.realisasi_anggaran,
    };
  }

  return [
    {
      title: "Pemasukan",
      value: formatRupiah(data.pemasukan),
      iconName: "MoneyIcon",
      iconColorClass: "text-green-500 dark:text-green-100",
      bgColorClass: "bg-green-100 dark:bg-green-500",
    },
    {
      title: "Pengeluaran",
      value: formatRupiah(data.pengeluaran),
      iconName: "CartIcon",
      iconColorClass: "text-red-500 dark:text-red-100",
      bgColorClass: "bg-red-100 dark:bg-red-500",
    },
    {
      title: "Total Anggaran",
      value: formatRupiah(data.total_anggaran),
      iconName: "MoneyIcon",
      iconColorClass: "text-blue-500 dark:text-blue-100",
      bgColorClass: "bg-blue-100 dark:bg-blue-500",
    },
    {
      title: "Sisa Anggaran",
      value: formatRupiah(data.realisasi_anggaran),
      iconName: "ChatIcon",
      iconColorClass: "text-purple-500 dark:text-purple-100",
      bgColorClass: "bg-purple-100 dark:bg-purple-500",
    },
  ];
}

// export async function getCardSummaryData(): Promise<cardSummaryData[]> {
//   try {
//     const res = await axiosInstance.get("/superadmin/dashboard-summary");
//     const data = await res.data;

//     return [
//       {
//         title: "Pemasukan",
//         value: data.summary.total_pemasukan,
//         iconName: "MoneyIcon",
//         iconColorClass: "text-green-500 dark:text-green-100",
//         bgColorClass: "bg-green-100 dark:bg-green-500",
//       },
//       {
//         title: "Pengeluaran",
//         value: data.summary.total_pengeluaran,
//         iconName: "CartIcon",
//         iconColorClass: "text-red-500 dark:text-red-100",
//         bgColorClass: "bg-red-100 dark:bg-red-500",
//       },
//       {
//         title: "Total Anggaran",
//         value: data.summary.total_anggaran,
//         iconName: "MoneyIcon",
//         iconColorClass: "text-blue-500 dark:text-blue-100",
//         bgColorClass: "bg-blue-100 dark:bg-blue-500",
//       },
//       {
//         title: "Realisasi Anggaran",
//         value: data.summary.total_realisasi_anggaran,
//         iconName: "ChatIcon",
//         iconColorClass: "text-purple-500 dark:text-purple-100",
//         bgColorClass: "bg-purple-100 dark:bg-purple-500",
//       },
//     ];
//   } catch (error) {
//     console.error("Gagal fetch dashboard summary:", error);
//     return [];
//   }
// }

export interface TrendLineApiResponse {
  labels: string[]; // misal: ["Jan", "Feb", "Mar", ...]
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export async function fetchTrendLineData(): Promise<TrendLineApiResponse> {
  const res = await axiosInstance.get("/superadmin/dashboard-trendline");
  if (!res.data) throw new Error("Failed to fetch trend line data");
  return res.data;
}

export async function fetchTrendBarData(): Promise<TrendLineApiResponse> {
  const res = await axiosInstance.get("/superadmin/dashboard-trendbar");
  if (!res.data) {
    throw new Error("Gagal mengambil data trend bar");
  }
  return await res.data;
}

// utils/superadmin/dashboardData.ts
export interface DokumentasiCabangItem {
  id: string;
  name: string;
}

export async function fetchDokumentasiCabang(): Promise<
  DokumentasiCabangItem[]
> {
  const response = await axiosInstance.get("/superadmin/dashboard-summary");
  const data = await response.data;

  return data.branches.map((branch: any) => ({
    id: branch.branch_code,
    name: `${branch.branch_name}, ${branch.branch_address}`,
  }));
}
