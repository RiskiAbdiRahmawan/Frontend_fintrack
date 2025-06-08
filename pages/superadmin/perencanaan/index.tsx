import React, { useState, useEffect } from "react";
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import DetailPerencanaanModal from "./detail";
import RevisiModal from "./revisi";
import TolakModal from "./tolak";

type RAKRow = {
  id: number;
  periode: string;
  cabang: string;
  jumlah: number;
  status: string;
};

type Alokasi = {
  id: number;
  kategori: string;
  keterangan: string;
  jumlah: number;
};

type RiwayatAksi = {
  tanggal: string;
  aksi: string;
  oleh: string;
};

type DetailPerencanaan = {
  id: number;
  periode: string;
  cabang: string;
  status: string;
  diajukanOleh: string;
  tanggalPengajuan: string;
  catatan: string;
  lampiran: string;
  alokasi: Alokasi[];
  riwayat?: RiwayatAksi[];
};

const detailData: Record<number, DetailPerencanaan> = {
  1: {
    id: 1,
    periode: "Januari 2025",
    cabang: "Sport Center Malang",
    status: "Diajukan",
    diajukanOleh: "Admin Malang",
    tanggalPengajuan: "2025-01-01",
    catatan: "Butuh dana untuk renovasi lapangan",
    lampiran: "dokumen_renovasi.pdf",
    alokasi: [
      {
        id: 1,
        kategori: "Renovasi",
        keterangan: "Pengecatan lapangan",
        jumlah: 5000000,
      },
      {
        id: 2,
        kategori: "Peralatan",
        keterangan: "Pembelian bola dan net",
        jumlah: 10000000,
      },
    ],
  },
};

const initialData: RAKRow[] = [
  {
    id: 1,
    periode: "Januari 2025",
    cabang: "Sport Center Malang",
    jumlah: 15000000,
    status: "Diajukan",
  },
  {
    id: 2,
    periode: "Februari 2025",
    cabang: "Sport Center Jakarta",
    jumlah: 12000000,
    status: "Disetujui",
  },
  {
    id: 3,
    periode: "Maret 2025",
    cabang: "Sport Center Bandung",
    jumlah: 17000000,
    status: "Revisi",
  },
  {
    id: 4,
    periode: "April 2025",
    cabang: "Sport Center Surabaya",
    jumlah: 9000000,
    status: "Ditolak",
  },
  {
    id: 5,
    periode: "Januari 2025",
    cabang: "Sport Center Malang",
    jumlah: 15000000,
    status: "Diajukan",
  },
  {
    id: 6,
    periode: "Februari 2025",
    cabang: "Sport Center Jakarta",
    jumlah: 12000000,
    status: "Disetujui",
  },
  {
    id: 7,
    periode: "Maret 2025",
    cabang: "Sport Center Bandung",
    jumlah: 17000000,
    status: "Revisi",
  },
  {
    id: 8,
    periode: "April 2025",
    cabang: "Sport Center Surabaya",
    jumlah: 9000000,
    status: "Ditolak",
  },
  {
    id: 9,
    periode: "Januari 2025",
    cabang: "Sport Center Malang",
    jumlah: 15000000,
    status: "Diajukan",
  },
  {
    id: 10,
    periode: "Februari 2025",
    cabang: "Sport Center Jakarta",
    jumlah: 12000000,
    status: "Disetujui",
  },
  {
    id: 11,
    periode: "Maret 2025",
    cabang: "Sport Center Bandung",
    jumlah: 17000000,
    status: "Revisi",
  },
  {
    id: 12,
    periode: "April 2025",
    cabang: "Sport Center Surabaya",
    jumlah: 9000000,
    status: "Ditolak",
  },
];

export default function Perencanaan() {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<RAKRow[]>(initialData);
  const [search, setSearch] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPerencanaan, setSelectedPerencanaan] =
    useState<DetailPerencanaan | null>(null);

  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [idRevisi, setIdRevisi] = useState<number | null>(null);

  const [showTolakModal, setShowTolakModal] = useState(false);
  const [idTolak, setIdTolak] = useState<number | null>(null);

  // Filter data berdasarkan search
  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.id.toString().includes(searchLower) ||
      item.periode.toLowerCase().includes(searchLower) ||
      item.cabang.toLowerCase().includes(searchLower) ||
      item.jumlah.toString().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const endIdx = startIdx + entriesPerPage;
  const displayedData = filteredData.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1); // reset page saat search berubah
  }, [search]);

  function openRevisiModal(id: number) {
    setIdRevisi(id);
    setShowRevisiModal(true);
  }

  function closeRevisiModal() {
    setShowRevisiModal(false);
    setIdRevisi(null);
  }

  function handleSubmitRevisi(message: string) {
    if (idRevisi !== null) {
      handleUpdateStatus(idRevisi, "Revisi");
      console.log("Pesan revisi:", message);
    }
    closeRevisiModal();
  }

  function handleLihatDetail(id: number) {
    const detail = detailData[id] ?? null;
    if (!detail) {
      alert("Detail perencanaan tidak ditemukan.");
      return;
    }
    setSelectedPerencanaan(detail);
    setShowDetail(true);
  }

  function handleCloseDetail() {
    setShowDetail(false);
    setSelectedPerencanaan(null);
  }

  function handleUpdateStatus(id: number, newStatus: string) {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    const now = new Date().toISOString().split("T")[0];

    if (detailData[id]) {
      const updatedRiwayat = [
        ...(detailData[id].riwayat || []),
        {
          tanggal: now,
          aksi: newStatus,
          oleh: "Superadmin",
        },
      ];
      detailData[id].status = newStatus;
      detailData[id].riwayat = updatedRiwayat;
    }

    if (selectedPerencanaan?.id === id) {
      setSelectedPerencanaan({
        ...selectedPerencanaan,
        status: newStatus,
        riwayat: [
          ...(selectedPerencanaan.riwayat || []),
          {
            tanggal: now,
            aksi: newStatus,
            oleh: "Superadmin",
          },
        ],
      });
    }
  }

  function openTolakModal(id: number) {
    setIdTolak(id);
    setShowTolakModal(true);
  }

  function closeTolakModal() {
    setShowTolakModal(false);
    setIdTolak(null);
  }

  function handleSubmitTolak(reason: string) {
    if (idTolak !== null) {
      handleUpdateStatus(idTolak, "Ditolak");
      console.log("Alasan tolak:", reason);
    }
    closeTolakModal();
  }

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
        return "text-gray-600";
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            {displayedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Tidak ada data perencanaan.
                </td>
              </tr>
            ) : (
              displayedData.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{startIdx + index + 1}</td>
                  <td className="px-4 py-2">{row.periode}</td>
                  <td className="px-4 py-2">{row.cabang}</td>
                  <td className="px-4 py-2 text-left">
                    Rp {row.jumlah.toLocaleString("id-ID")}
                  </td>
                  <td className={`px-4 py-2 ${getStatusClass(row.status)}`}>
                    {row.status}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="flex items-center bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        onClick={() => handleLihatDetail(row.id)}
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
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-50 text-sm text-gray-600 border-t gap-2 sm:gap-0 border-t border-b">
        <div className="flex items-center gap-2">
          <span>Lihat</span>
          <select
            className="block appearance-none w-full border border-gray-300 rounded px-4 py-1 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>Antrian Data</span>
        </div>
        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            className={`rounded border px-2 py-1 transition-colors duration-200 ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Sebelumnya
          </button>

          <span>
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            className={`rounded border px-2 py-1 transition-colors duration-200 ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {showDetail && selectedPerencanaan && (
        <DetailPerencanaanModal
          perencanaan={selectedPerencanaan}
          onClose={handleCloseDetail}
          onApprove={(id) => handleUpdateStatus(id, "Disetujui")}
          onReject={(id) => {
            openTolakModal(id);
          }}
          onRevisi={(id) => {
            openRevisiModal(id);
          }}
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
