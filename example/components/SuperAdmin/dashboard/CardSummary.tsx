// src/components/CardSummary.tsx
import React, { useEffect, useState } from "react";
import InfoCard from "example/components/Cards/InfoCard";
import RoundIcon from "example/components/RoundIcon";
import { MoneyIcon, CartIcon, ChatIcon } from "icons";
import {
  cardSummaryData,
  getDashboardSummary,
  createCardSummaryData,
  DashboardSummaryResponse,
} from "utils/superadmin/dashboardData";

const iconMap = {
  MoneyIcon,
  CartIcon,
  ChatIcon,
};

export default function CardSummary() {
  const [dashboardData, setDashboardData] =
    useState<DashboardSummaryResponse | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardSummary();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const formatRupiah = (value: number | string): string => {
  //   const number = Math.floor(Number(value)); // Buang desimal
  //   return `Rp. ${number.toLocaleString("id-ID")},00`;
  // };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  if (!dashboardData)
    return <div className="text-center py-4">No data available</div>;

  const cardData = createCardSummaryData(selectedBranch, dashboardData);

  return (
    <div className="space-y-6 pb-6">
      {/* Branch Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Dashboard Summary
        </h2>

        <div className="flex items-center gap-2">
          <label
            htmlFor="branch-select"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Filter Branch:
          </label>
          <select
            id="branch-select"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Semua Cabang</option>
            {dashboardData.branches.map((branch) => (
              <option key={branch.branch_code} value={branch.branch_code}>
                {branch.branch_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {cardData.map(
          ({ title, value, iconName, iconColorClass, bgColorClass }) => {
            const Icon = iconMap[iconName as keyof typeof iconMap];
            return (
              <InfoCard key={title} title={title} value={value}>
                {/* @ts-ignore */}
                <RoundIcon
                  icon={Icon}
                  iconColorClass={iconColorClass}
                  bgColorClass={bgColorClass}
                  className="mr-4"
                />
              </InfoCard>
            );
          }
        )}
      </div>

      {/* Branch Info (when specific branch is selected) */}
      {selectedBranch !== "all" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {(() => {
            const branch = dashboardData.branches.find(
              (b) => b.branch_code === selectedBranch
            );
            return branch ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {branch.branch_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Kode:</span>{" "}
                  {branch.branch_code}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Alamat:</span>{" "}
                  {branch.branch_address}
                </p>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
