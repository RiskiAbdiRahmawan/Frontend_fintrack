import React, { useEffect } from "react";
import { Input, Label, Button, Select } from "@roketid/windmill-react-ui";
import { Budget, BudgetItem } from "./type";

type Props = {
  budget: Budget;
  onChange: (updatedBudget: Budget) => void;
  onClose: () => void;
  onSubmitWithStatus?: (status: "Draft" | "Diajukan") => void;
  kategoriOptions: string[];
};

const EditBudgetModal: React.FC<Props> = ({
  budget,
  onChange,
  onClose,
  onSubmitWithStatus,
  kategoriOptions = [],
}) => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Pastikan items selalu array
  const items = budget.items || [];

  useEffect(() => {
    if (!budget.items || budget.items.length === 0) {
      onChange({
        ...budget,
        periode: budget.periode || `${currentYear}-01`,
        tanggalPengajuan: budget.tanggalPengajuan || new Date().toISOString().slice(0, 10),
        status: budget.status || "Draft",
        items: [{ kategori: "", deskripsi: "", jumlah: 0 }],
        amount: 0,
      });
    }
  }, [budget, currentYear, onChange]);

  const handleDetailChange = (
    index: number,
    field: keyof BudgetItem,
    value: string | number
  ) => {
    const updatedItems = [...items];
    if (field === "kategori" || field === "deskripsi") {
      updatedItems[index][field] = value as string;
    } else if (field === "jumlah") {
      const parsed = Number(value);
      updatedItems[index][field] = isNaN(parsed) ? 0 : parsed;
    }
    const newTotal = updatedItems.reduce((sum, item) => sum + item.jumlah, 0);
    onChange({ ...budget, items: updatedItems, amount: newTotal });
  };

  const addItemRow = (e: React.MouseEvent) => {
    e.stopPropagation(); // cegah klik menyebar keluar modal
    const newItem: BudgetItem = { kategori: "", deskripsi: "", jumlah: 0 };
    onChange({ ...budget, items: [...items, newItem] });
  };

  const removeItemRow = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // cegah klik menyebar keluar modal
    if (items.length <= 1) return;
    const updatedItems = items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.jumlah, 0);
    onChange({ ...budget, items: updatedItems, amount: newTotal });
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-gray-300 text-gray-700",
    Diajukan: "bg-blue-200 text-blue-800",
    Revisi: "bg-yellow-200 text-yellow-800",
    "Revisi Diminta": "bg-orange-200 text-orange-800",
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-bold">Edit Perencanaan Anggaran</h3>
        </div>

        <div className="p-6 space-y-6">
          {budget.catatanAdmin && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
              <strong>Catatan Admin:</strong>
              <p className="mt-1 whitespace-pre-line">{budget.catatanAdmin}</p>
            </div>
          )}

          {/* Periode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                <span>Bulan</span>
                <Select
                  value={budget.periode?.split("-")[1] || "01"}
                  onChange={(e) => {
                    const bulan = e.target.value.padStart(2, "0");
                    const tahun = budget.periode?.split("-")[0] || currentYear.toString();
                    onChange({ ...budget, periode: `${tahun}-${bulan}` });
                  }}
                >
                  {months.map((m, i) => (
                    <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                      {m}
                    </option>
                  ))}
                </Select>
              </Label>
            </div>
            <div>
              <Label>
                <span>Tahun</span>
                <Select
                  value={budget.periode?.split("-")[0] || currentYear.toString()}
                  onChange={(e) => {
                    const tahun = e.target.value;
                    const bulan = budget.periode?.split("-")[1] || "01";
                    onChange({ ...budget, periode: `${tahun}-${bulan}` });
                  }}
                >
                  {years.map((y) => (
                    <option key={y} value={y.toString()}>
                      {y}
                    </option>
                  ))}
                </Select>
              </Label>
            </div>
          </div>

          {/* Tanggal Pengajuan */}
          <Label>
            <span>Tanggal Pengajuan</span>
            <Input
              type="date"
              readOnly
              value={
                typeof budget.tanggalPengajuan === "string"
                  ? budget.tanggalPengajuan
                  : budget.tanggalPengajuan instanceof Date
                  ? budget.tanggalPengajuan.toISOString().slice(0, 10)
                  : ""
              }
            />
          </Label>

          {/* Status */}
          <div className="mt-4">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full font-semibold ${
                statusColors[budget.status || "Draft"]
              }`}
            >
              {budget.status || "Draft"}
            </span>
          </div>

          {/* Tabel Rincian */}
          <div>
            <span className="font-medium">Rincian Anggaran:</span>
            <table className="w-full mt-2 text-sm border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">No</th>
                  <th className="border px-2 py-1">Kategori</th>
                  <th className="border px-2 py-1">Deskripsi</th>
                  <th className="border px-2 py-1">Jumlah (Rp)</th>
                  <th className="border px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1 text-center">{index + 1}</td>
                    <td className="border px-2 py-1">
                    <Select
                      value={item.kategori}
                      onChange={(e) => handleDetailChange(index, "kategori", e.target.value)}
                    >
                      <option value="">Pilih</option>
                      {kategoriOptions.map((kategori, i) => (
                        <option key={i} value={kategori}>
                          {kategori}
                        </option>
                      ))}
                    </Select>
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        value={item.deskripsi}
                        onChange={(e) =>
                          handleDetailChange(index, "deskripsi", e.target.value)
                        }
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <Input
                        type="number"
                        value={item.jumlah === 0 ? "" : item.jumlah}
                        onChange={(e) =>
                          handleDetailChange(index, "jumlah", e.target.value)
                        }
                        min={0}
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={(e) => removeItemRow(e, index)}
                        disabled={items.length <= 1}
                        className="text-red-600 border border-red-600 px-3 py-1 rounded-md transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={3} className="text-right px-2 py-1 border">
                    Total
                  </td>
                  <td className="px-2 py-1 border">
                    Rp {budget.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="border"></td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 px-4 py-2 border-2 border-blue-900 text-blue-900 bg-white rounded-md hover:bg-blue-50"
            >
              + Tambah Rincian
            </button>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 p-4 rounded-b-lg">
            <Button
              layout="outline"
              onClick={onClose}
              className="mr-auto border-blue-900 text-blue-900 hover:bg-blue-100"
              type="button"
            >
              Batal
            </Button>
            <Button
              onClick={() => onSubmitWithStatus && onSubmitWithStatus("Draft")}
              type="button"
              className="bg-blue-900 text-white hover:bg-blue-800"
            >
              Simpan Draft
            </Button>
            <Button
              onClick={() => onSubmitWithStatus && onSubmitWithStatus("Diajukan")}
              type="button"
              className="bg-blue-900 text-white hover:bg-blue-800"
            >
              Ajukan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetModal;
