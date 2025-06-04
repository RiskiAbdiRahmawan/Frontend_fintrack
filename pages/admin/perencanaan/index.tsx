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
import EditBudgetModal from "./edit"; // Modal khusus edit
import { MoneyIcon } from "icons";
import { Budget, BudgetItem } from "./type";

// Format tanggal
function formatTanggal(date: Date | string) {
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const d = new Date(date);
  const day = d.getDate();
  const month = bulan[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

const initialBudgets: Budget[] = [
    {
      id: 1,
      periode: "Juni 2025",
      tanggalPengajuan: new Date("2025-05-01"),
      status: "Diajukan",
      catatanAdmin: "Gaji sudah sesuai standar",
      items: [
        {
          kategori: "Gaji Karyawan",
          deskripsi: "Gaji bulanan staf",
          jumlah: 4000000,
        },
        {
          kategori: "Transportasi",
          deskripsi: "Biaya transportasi staf",
          jumlah: 500000,
        },
      ],
      amount: 4500000,
      spent: 0,
    },
    {
      id: 2,
      periode: "Juni 2025",
      tanggalPengajuan: new Date("2025-05-03"),
      status: "Revisi Diminta",
      catatanAdmin: "Mohon sesuaikan jumlah tagihan listrik bulan lalu.",
      items: [
        {
          kategori: "Listrik",
          deskripsi: "Tagihan listrik PLN",
          jumlah: 1000000,
        },
      ],
      amount: 1000000,
      spent: 0,
    },
    {
      id: 3,
      periode: "Maret 2025",
      tanggalPengajuan: new Date("2025-02-15"),
      status: "Draft",
      items: [
        {
          kategori: "PDAM",
          deskripsi: "Pembayaran air",
          jumlah: 1000000,
        },
        {
          kategori: "Peralatan Kantor",
          deskripsi: "Pembelian alat tulis",
          jumlah: 300000,
        },
        {
          kategori: "Konsumsi",
          deskripsi: "Snack rapat",
          jumlah: 200000,
        },
      ],
      amount: 1500000,
      spent: 0,
    },
    {
      id: 4,
      periode: "Maret 2025",
      tanggalPengajuan: new Date("2025-02-20"),
      status: "Disetujui",
      items: [
        {
          kategori: "Kebutuhan Lapangan",
          deskripsi: "Perbaikan rumput lapangan",
          jumlah: 500000,
        },
      ],
      amount: 500000,
      spent: 0,
    },
    {
      id: 5,
      periode: "Mei 2025",
      tanggalPengajuan: new Date("2025-01-28"),
      status: "Ditolak",
      catatanAdmin: "Tidak ada detail penggunaan anggaran.",
      items: [
        {
          kategori: "Kebutuhan Lainnya",
          deskripsi: "Miscellaneous",
          jumlah: 500000,
        },
      ],
      amount: 500000,
      spent: 0,
    },
  ];

function PerencanaanAnggaran() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filtered, setFiltered] = useState<Budget[]>(initialBudgets);
  const [selected, setSelected] = useState<Budget | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const [newBudget, setNewBudget] = useState<Budget>({
    id: 0,
    amount: 0,
    spent: 0,
    periode: "",
    tanggalPengajuan: new Date(),
    status: "Draft",
    catatanAdmin: "",
    items: [],
  });

  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const totalResults = filtered.length;

  useEffect(() => {
    const f = budgets.filter((b) =>
      b.items.some((item) =>
        item.kategori.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
    setFiltered(f);
    setPage(1);
  }, [searchKeyword, budgets]);

  const handleDelete = (id: number) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    setSelected(null);
  };

  const handleAdd = () => {
    const id = budgets.length > 0 ? Math.max(...budgets.map((b) => b.id)) + 1 : 1;
  
    const periodeBaru = (() => {
      const d = newBudget.tanggalPengajuan;
      const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return `${bulan[d.getMonth()]} ${d.getFullYear()}`;
    })();
  
    const totalAmount = newBudget.items.reduce((acc, item) => acc + item.jumlah, 0);
  
    const budget = { ...newBudget, id, periode: periodeBaru, amount: totalAmount };
  
    setBudgets([...budgets, budget]);
    setAdding(false);
    setNewBudget({
      id: 0,
      amount: 0,
      spent: 0,
      periode: "",
      tanggalPengajuan: new Date(),
      status: "Draft",
      catatanAdmin: "",
      items: [],
    });
  };

  const handleBudgetChange = (updatedBudget: Budget) => {
    setEditing(updatedBudget);
  };

  const handleSubmitWithStatus = (status: "Draft" | "Diajukan") => {
    if (editing) {
      const updated = { ...editing, status };
      // update array budgets
      setBudgets((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      setEditing(null); // tutup modal setelah submit
    }
  };
  const handleUpdate = (updatedBudget: Budget) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))
    );
    setEditing(null);
  };

  const paginated = filtered.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const totalPlanned = budgets.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const totalDifference = totalPlanned - totalSpent;

  return (
    <Layout>
      <PageTitle>Perencanaan Anggaran</PageTitle>

      {/* Ringkasan Anggaran */}
      <div className="flex flex-row gap-4 mb-4">
        {[
          { label: "Total Anggaran Direncanakan", value: totalPlanned, color: "text-blue-600" },
          { label: "Total Pengeluaran", value: totalSpent, color: "text-green-600" },
          { label: "Total Selisih", value: totalDifference, color: "text-red-600" },
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
      </div>

      {/* Header Tabel */}
      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Perencanaan Anggaran</h3>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setAdding(true)}
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
              {paginated.map((b, idx) => (
                <TableRow key={b.id}>
                  <TableCell>{(page - 1) * resultsPerPage + idx + 1}</TableCell>
                  <TableCell>{b.periode}</TableCell>
                  <TableCell>Rp {b.amount.toLocaleString("id-ID")}</TableCell>
                  <TableCell>{b.tanggalPengajuan ? formatTanggal(b.tanggalPengajuan) : "-"}</TableCell>
                  <TableCell>{b.status}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      className="bg-blue-700 text-white"
                      onClick={() => setSelected(b)}
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
      {adding && (
        <AddBudgetModal
          budget={newBudget}
          onChange={setNewBudget}
          onClose={() => setAdding(false)}
          onAdd={handleAdd}
        />
      )}

      {/* Modal Detail */}
      {selected && (
        <DetailBudgetModal
          budget={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected);
            setSelected(null);
          }}
          onDelete={() => {
            handleDelete(selected.id);
            setSelected(null);
          }}
          isEditable={true}
          isDeletable={true}
        />
      )}

      {/* Modal Edit */}
      {editing && (
        <EditBudgetModal
          onClose={() => setEditing(null)}
          budget={editing}
          onChange={handleBudgetChange}
          onSubmitWithStatus={handleSubmitWithStatus} kategoriOptions={[]}        />
      )}
    </Layout>
  );
}

export default PerencanaanAnggaran;
