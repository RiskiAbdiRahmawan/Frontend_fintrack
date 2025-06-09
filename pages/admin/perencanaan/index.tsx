import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
} from "@roketid/windmill-react-ui";
import { EyeIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/solid";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";

import AddBudgetModal from "./tambah";
import DetailBudgetModal from "./detail";
import EditBudgetModal from "./edit";
import { MoneyIcon } from "icons";

import {
  deleteRak,
  getRakByBranch,
  getRakById,
  updateRakStatus,
} from "service/rakService";
import {
  RakBase,
  RakResponseDetail,
  CreateBudget,
  CreateBudgetDetail,
  UpdateRak,
} from "types/rak";

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

function formatTanggal(date: Date | string) {
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
  const day = d.getDate();
  const month = bulan[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function PerencanaanAnggaran() {
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface BudgetFormData {
    period: string;
    submission_date: string;
    status: string;
    detail: BudgetDetailItem[];
  }

  interface BudgetDetailItem {
    category_id: number;
    description: string;
    amount: number;
  }

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

  //add
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleAdd = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  const initialRak: CreateBudget = {
    user_id: 0,
    branch_id: 0,
    period: "",
    status: "",
    submission_date: "",
  };
  const initialRakDetail: CreateBudgetDetail = {
    budget_id: 0,
    category_id: 0,
    description: "",
    amount: 0,
  };

  //edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<RakResponseDetail | null>(
    null
  );
  const openEditModal = (perencanaan: RakResponseDetail) => {
    setEditingBudget(perencanaan);
    setIsEditModalOpen(true);
    setIsModalOpen(false);
  };
  const closeEditModal = () => {
    setEditingBudget(null);
    setIsEditModalOpen(false);
  };

  //delete
  const handleDeleteBudget = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus budget ini?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteRak(id);
      await fetchPerencanaan();
      closePerencanaanDetails();
      alert("Budget berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Gagal menghapus budget");
    } finally {
      setLoading(false);
    }
  };

  //ajukan
  const handleAjukan = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menyetujui pengajuan ini?")) {
      handleUpdateStatus(id, "diajukan");
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
      alert("Budget berhasil diajukan!");
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
      const branchId = Number(localStorage.getItem("branch_id"));
      const response = await getRakByBranch(branchId);
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
          rak.submission_date.toLowerCase().includes(searchLower) ||
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

      {/* Ringkasan Anggaran */}
      {/* <div className="flex flex-row gap-4 mb-4">
        {[
          {
            label: "Total Anggaran Direncanakan",
            value: totalPlanned,
            color: "text-blue-600",
          },
          {
            label: "Total Pengeluaran",
            value: totalSpent,
            color: "text-green-600",
          },
          {
            label: "Total Selisih",
            value: totalDifference,
            color: "text-red-600",
          },
        ].map(({ label, value, color }, i) => (
          <div
            key={i}
            className="bg-white px-6 py-4 rounded-lg shadow-md inline-flex min-w-[300px] max-w-fit h-[80px] items-center"
          >
            <MoneyIcon className={`w-6 h-6 ${color} mr-2`} />
            <h3 className="text-xl font-semibold">
              {label}: Rp {value.toLocaleString("id-ID")}
            </h3>
          </div>
        ))}
      </div> */}

      {/* Header Tabel */}
      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Perencanaan Anggaran</h3>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
      </div>

      {/* Tabel */}
      <div className="bg-white shadow-md rounded-b-lg overflow-x-auto">
        <div className="p-4">
          <Input
            placeholder="🔍 Cari anggaran..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-1/3 mb-4"
          />
        </div>

        <TableContainer className="max-w-[1400px] mx-auto overflow-x-auto mb-10">
          <Table>
            <TableHeader>
              <tr className="bg-indigo-100">
                <TableCell>No</TableCell>
                <TableCell>Periode</TableCell>
                <TableCell>Jumlah Anggaran</TableCell>
                <TableCell>Tanggal Pengajuan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aksi</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {rakData.map((rak, idx) => (
                <TableRow key={rak.id}>
                  <TableCell>{(page - 1) * resultsPerPage + idx + 1}</TableCell>
                  <TableCell>{formatPeriod(rak.period)}</TableCell>
                  <TableCell>
                    Rp {(rak.total_amount ?? 0).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {rak.submission_date
                      ? formatTanggal(rak.submission_date)
                      : "-"}
                  </TableCell>
                  <TableCell className={`${getStatusClass(rak.status)}`}>
                    {rak.status}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      className="bg-blue-700 text-white"
                      onClick={() => openPerencanaanDetails(rak.id)}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" /> Lihat
                    </Button>
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
                    setResultsPerPage(parseInt(e.target.value));
                    setPage(1);
                  }}
                >
                  {[10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
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

      {/* Modal Tambah */}
      {isAddModalOpen && (
        <AddBudgetModal
          rakData={initialRak}
          rakDetailData={initialRakDetail}
          onClose={closeAddModal}
          onSuccess={() => {
            getRakByBranch(Number(localStorage.getItem("branch_id"))).then(
              (res) => {
                setAllRakData(res.data);
                setTotalResults(res.data.length);
              }
            );
          }}
        />
      )}

      {/* Modal Detail */}
      {isModalOpen && selectedPerencanaan && (
        <DetailBudgetModal
          perencanaan={selectedPerencanaan}
          onClose={closePerencanaanDetails}
          onEdit={() => openEditModal(selectedPerencanaan)}
          onDelete={() => handleDeleteBudget(selectedPerencanaan.data.id)}
          onAjukan={() => handleAjukan(selectedPerencanaan.data.id)}
          isEditable={true}
          isDeletable={true}
        />
      )}

      {/* Modal Edit */}
      {isEditModalOpen && editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onClose={closeEditModal}
          onSuccess={() => {
            getRakByBranch(Number(localStorage.getItem("branch_id"))).then(
              (res) => {
                setAllRakData(res.data);
                setTotalResults(res.data.length);
              }
            );
          }}
          loading={loading}
        />
      )}
    </Layout>
  );
}

export default PerencanaanAnggaran;
