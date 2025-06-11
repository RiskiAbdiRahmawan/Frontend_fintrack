import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  TableFooter,
  Button,
  Input,
  Badge,
  Pagination,
} from "@roketid/windmill-react-ui";
import { DocumentTextIcon, CheckIcon } from "@heroicons/react/24/outline";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import { RekapType } from "types/rekap";
import { getRekapByBranch, handleExportExcel } from "service/rekapService";

const getFormattedPeriode = (periode: string): string => {
  const [month, year] = periode.split("-");
  const monthNames = {
    "01": "Januari",
    "02": "Februari",
    "03": "Maret",
    "04": "April",
    "05": "Mei",
    "06": "Juni",
    "07": "Juli",
    "08": "Agustus",
    "09": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember",
  };
  return `${monthNames[month as keyof typeof monthNames]} ${year}`;
};

const RekaptulasiPage = () => {
  const [exportState, setExportState] = useState({ status: "idle" });

  // Data state
  const [data, setData] = useState<RekapType[]>([]);
  const [filteredData, setFilteredData] = useState<RekapType[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const totalResults = filteredData.length;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchId = Number(localStorage.getItem("branch_id"));
        if (!branchId) {
          console.error("Branch ID not found in localStorage");
          return;
        }
        const response = await getRekapByBranch(branchId);
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter data
  useEffect(() => {
    const filtered = data.filter((item) => {
      const [month, year] = item.periode.split("-");
      return (
        (selectedYear ? year === selectedYear : true) &&
        (selectedMonth ? month === selectedMonth : true)
      );
    });
    setFilteredData(filtered);
    setPage(1);
  }, [selectedMonth, selectedYear, data]);

  // Format currency
  const formatCurrency = (amount: string): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));

  // Get unique years from periode
  const years = Array.from(
    new Set(data.map((item) => item.periode.split("-")[1]))
  ).sort((a, b) => b.localeCompare(a));

  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  return (
    <Layout>
      <PageTitle>Rekaptulasi & Tutup Buku</PageTitle>

      {/* Status Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 rounded-full bg-blue-100 text-blue-500">
            <DocumentTextIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Periode Aktif</p>
            <p className="text-lg font-semibold">
              {selectedMonth || "Semua Bulan"} {selectedYear}
            </p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 rounded-full bg-green-100 text-green-500">
            <CheckIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-lg font-semibold">
              {filteredData.length > 0 &&
              filteredData[0].total_locked === filteredData[0].total_transaksi
                ? "Terkunci"
                : "Belum Ditutup"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700"
          >
            Bulan
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Semua Bulan</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Tahun
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Semua Tahun</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto mt-auto">
          <Button
            layout="outline"
            onClick={() => {
              setSelectedMonth("");
              setSelectedYear("");
            }}
          >
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
        <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Data Rekapitulasi</h3>
        </div>

        <TableContainer>
          <Table id="rekapitulasi-table">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableCell>No</TableCell>
                <TableCell>Periode</TableCell>
                <TableCell>Pemasukan</TableCell>
                <TableCell>Pengeluaran</TableCell>
                <TableCell>Anggaran</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                .slice((page - 1) * resultsPerPage, page * resultsPerPage)
                .map((item, index) => (
                  <TableRow key={item.periode}>
                    <TableCell>
                      {(page - 1) * resultsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      {getFormattedPeriode(item.periode)}
                      <div className="text-xs text-gray-500">
                        {item.total_transaksi} transaksi
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.total_pemasukan.toString())}
                      <div className="text-xs text-gray-500">
                        {item.total_transaksi_pemasukan} transaksi
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.total_pengeluaran.toString())}
                      <div className="text-xs text-gray-500">
                        {item.total_transaksi_pengeluaran} transaksi
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.total_anggaran.toString())}
                    </TableCell>
                    <TableCell>
                      <Badge
                        type={
                          item.total_locked === item.total_transaksi
                            ? "success"
                            : "warning"
                        }
                      >
                        {item.total_locked === item.total_transaksi
                          ? "Terkunci"
                          : "Terbuka"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableFooter>
            <div className="flex flex-col md:flex-row items-center justify-between p-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Show</span>
                <select
                  className="form-select w-20 text-sm"
                  value={resultsPerPage}
                  onChange={(e) => {
                    setResultsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-500 ml-2">entries</span>
              </div>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={setPage}
                label="Table navigation"
              />
            </div>
          </TableFooter>
        </TableContainer>
      </div>

      {/* Export Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 w-full md:w-1/2">
        <div className="bg-indigo-900 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Unduh Rekapitulasi</h3>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">
              Informasi Laporan
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Periode:</span>{" "}
                {selectedMonth || "Semua Bulan"} {selectedYear}
              </p>
              <p>
                <span className="font-medium">Jenis:</span> Rekapitulasi Bulanan
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-6 justify-end">
            <Button
              className="flex items-center bg-red-600 text-white hover:bg-red-700 px-4 py-2"
              // onClick={handleExportPDF}
              disabled={exportState.status === "exporting_pdf"}
            >
              {exportState.status === "exporting_pdf" ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">Download PDF</span>
              )}
            </Button>

            <Button
              className="flex items-center bg-green-600 text-white hover:bg-green-700 px-4 py-2"
              onClick={() => handleExportExcel(setExportState)}
              disabled={exportState.status === "exporting_excel"}
            >
              {exportState.status === "exporting_excel" ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">Download Excel</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RekaptulasiPage;
