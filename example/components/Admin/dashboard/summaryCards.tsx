// dashboard/components/SummaryCards.tsx
import InfoCard from "example/components/Cards/InfoCard";
import RoundIcon from "example/components/RoundIcon";
import { MoneyIcon, CartIcon } from "icons";
import {
  fetchDashboardSummary,
  DashboardSummary,
} from "../../../../utils/admin/dashboardAdminData";
import React, { useEffect, useState } from "react";

export default function SummaryCards() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardSummary()
      .then((data) => setSummary(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!summary) return <div>Loading...</div>;

  // Format angka ke string dengan titik ribuan dan koma desimal Indonesia
  const formatRupiah = (value: number | string): string => {
    const number = Math.floor(Number(value));
    return `Rp. ${number.toLocaleString("id-ID")},00`;
  };

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      <InfoCard title="Pemasukan" value={formatRupiah(summary.pemasukan)}>
        {/* @ts-ignore */}
        <RoundIcon
          icon={MoneyIcon}
          iconColorClass="text-green-500 dark:text-green-100"
          bgColorClass="bg-green-100 dark:bg-green-500"
          className="mr-4"
        />
      </InfoCard>
      <InfoCard title="Pengeluaran" value={formatRupiah(summary.pengeluaran)}>
        {/* @ts-ignore */}
        <RoundIcon
          icon={CartIcon}
          iconColorClass="text-red-500 dark:text-red-100"
          bgColorClass="bg-red-100 dark:bg-red-500"
          className="mr-4"
        />
      </InfoCard>
      <InfoCard title="Anggaran" value={formatRupiah(summary.total_anggaran)}>
        {/* @ts-ignore */}
        <RoundIcon
          icon={MoneyIcon}
          iconColorClass="text-blue-500 dark:text-blue-100"
          bgColorClass="bg-blue-100 dark:bg-blue-500"
          className="mr-4"
        />
      </InfoCard>
      <InfoCard
        title="Sisa Anggaran"
        value={formatRupiah(summary.realisasi_anggaran)}
      >
        {/* @ts-ignore */}
        <RoundIcon
          icon={MoneyIcon}
          iconColorClass="text-purple-500 dark:text-purple-100"
          bgColorClass="bg-purple-100 dark:bg-purple-500"
          className="mr-4"
        />
      </InfoCard>
    </div>
  );
}
