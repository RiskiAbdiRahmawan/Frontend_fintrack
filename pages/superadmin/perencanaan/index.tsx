import React, { useState, useEffect } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import Loader from "example/components/Loader/Loader";

import DetailPerencanaanModal from "./detail";
import RevisiModal from "./revisi";
import TolakModal from "./tolak";

import { RakBase, RakResponseDetail } from "types/rak";
import { getRakAll, getRakById, updateRakStatus } from "service/rakService";
import {
  Pagination,
  TableCell,
  TableFooter,
  TableRow,
} from "@roketid/windmill-react-ui";

function formatPeriod(date: Date | string) {
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const d = new Date(date);
  const month = bulan[d.getMonth()];
  const year = d.getFullYear();
  return `${month} ${year}`;
}

export default function Perencanaan() {
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //detail
  const [selectedPerencanaan, setSelectedPerencanaan] =
    useState<RakResponseDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openPerencanaanDetails = async (id: number) => {
    try {
      const rak = await getRakById(id);
      setSelectedPerencanaan(rak);
      setIsModalOpen(true);
    } catch (error) {
      console.log("Gagal mengambil detail perencanaan", error);
    }
  };
  const closePerencanaanDetails = () => {
    setSelectedPerencanaan(null);
    setIsModalOpen(false);
  };

  //tolak
  const [showTolakModal, setShowTolakModal] = useState(false);
  const [idTolak, setIdTolak] = useState<number | null>(null);
  function openTolakModal(id: number) {
    setIdTolak(id);
    setShowTolakModal(true);
  }
  function closeTolakModal() {
    setShowTolakModal(false);
    setIdTolak(null);
  }
  const handleSubmitTolak = async (note: string) => {
    if (idTolak) {
      await handleUpdateStatus(idTolak, "ditolak", note);
      closeTolakModal();
    }
  };

  //revisi
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [idRevisi, setIdRevisi] = useState<number | null>(null);
  function openRevisiModal(id: number) {
    setIdRevisi(id);
    setShowRevisiModal(true);
  }
  function closeRevisiModal() {
    setShowRevisiModal(false);
    setIdRevisi(null);
  }
  const handleSubmitRevisi = async (note: string) => {
    if (idRevisi) {
      await handleUpdateStatus(idRevisi, "revisi", note);
      closeRevisiModal();
    }
  };

  //setuju
  const handleApprove = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menyetujui pengajuan ini?")) {
      handleUpdateStatus(id, "disetujui");
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: string,
    note?: string
  ) => {
    try {
      await updateRakStatus(id, status, note);
      await fetchPerencanaan();
      closePerencanaanDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengupdate status");
    }
  };

  //index
  const [allRakData, setAllRakData] = useState<RakBase[]>([]);
  const [rakData, setRakData] = useState<RakBase[]>([]);
  const fetchPerencanaan = async () => {
    try {
      setLoading(true);
      const response = await getRakAll();
      setAllRakData(response.data);
    } catch (error) {
      console.error("Error fetching Budget:", error);
      setError("Gagal mengambil data Perencanaan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerencanaan();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = allRakData.filter((rak) => {
        const searchLower = searchKeyword.toLowerCase();
        return (
          rak.period.toLowerCase().includes(searchLower) ||
          rak.branch.name.toLowerCase().includes(searchLower) ||
          rak.total_amount.toString().includes(searchLower) ||
          rak.status.toLowerCase().includes(searchLower)
        );
      });

      const start = (page - 1) * resultsPerPage;
      const pagination = filtered.slice(start, start + resultsPerPage);

      setRakData(pagination);
      setTotalResults(filtered.length);
    }, 300);

    return () => clearTimeout(timeout);
  }, [allRakData, searchKeyword, page, resultsPerPage]);

  function getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case "disetujui":
        return "text-green-600 font-bold";
      case "ditolak":
        return "text-red-600 font-bold";
      case "revisi":
        return "text-yellow-500 font-bold";
      case "diajukan":
        return "text-blue-600 font-bold";
      default:
        return "text-gray-600 font-bold";
    }
  }

  return (
    <Layout>
      <PageTitle>Perencanaan Anggaran</PageTitle>
      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg border-t border-b">
        <h3 className="text-lg font-semibold">
          List Pengajuan Perencanaan Anggaran
        </h3>
      </div>
      <div className="p-4">
        <div className="w-full max-w-sm">
          <input
            type="text"
            placeholder="🔍Cari Perencanaan"
            className="w-full pl-4 pr-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-auto overflow-x-auto mb-10">
        <table className="min-w-full text-sm">
          <thead className="bg-[#e7efff] text-gray-800">
            <tr>
              <th className="text-left px-4 py-2">No</th>
              <th className="text-left px-4 py-2">Periode</th>
              <th className="text-left px-4 py-2">Cabang</th>
              <th className="text-left px-4 py-2">Jumlah Anggaran</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading...
                  <Loader />
                </TableCell>
              </TableRow>
            ) : rakData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Tidak ada data perencanaan.
                </td>
              </tr>
            ) : (
              rakData.map((rak, index) => (
                <tr key={rak.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {(page - 1) * resultsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2">{formatPeriod(rak.period)}</td>
                  <td className="px-4 py-2">{rak.branch.name}</td>
                  <td className="px-4 py-2 text-left">
                    Rp {rak.total_amount.toLocaleString("id-ID")}
                  </td>
                  <td className={`px-4 py-2 ${getStatusClass(rak.status)}`}>
                    {rak.status}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="flex items-center bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        onClick={() => openPerencanaanDetails(rak.id)}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Lihat
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-5 bg-gray-50 text-sm text-gray-600 gap-2 sm:gap-0 border-t border-b">
          <div className="flex items-center gap-2">
            <span>Lihat</span>
            <select
              className="block appearance-none w-full border border-gray-300 rounded px-4 py-1 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={resultsPerPage}
              onChange={(e) => {
                setResultsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="min-w-[80px]">Antrian Data</span>
          </div>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
            label="Table navigation"
          />
        </div>
      </div>

      {isModalOpen && selectedPerencanaan && (
        <DetailPerencanaanModal
          perencanaan={selectedPerencanaan}
          onClose={closePerencanaanDetails}
          onReject={openTolakModal}
          onApprove={handleApprove}
          onRevisi={openRevisiModal}
        />
      )}
      {showTolakModal && (
        <TolakModal onClose={closeTolakModal} onSubmit={handleSubmitTolak} />
      )}
      {showRevisiModal && (
        <RevisiModal
          open={showRevisiModal}
          onClose={closeRevisiModal}
          onSubmit={handleSubmitRevisi}
        />
      )}
    </Layout>
  );
}
