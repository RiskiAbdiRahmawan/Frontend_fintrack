import React, { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { Input, Label, Button, Select } from "@roketid/windmill-react-ui";
import { Budget, BudgetItem } from "./type";
import DeleteBudgetModal from "./delete";

type Props = {
  budget: Budget;
  onChange: Dispatch<SetStateAction<Budget>>;
  onClose: () => void;
  onAdd: () => void;
};

const AddBudgetModal: React.FC<Props> = ({ budget, onChange, onClose, onAdd }) => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Format tanggal ke "1 Januari 2025"
  const formatTanggal = (date: Date) => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    if (!budget.items || budget.items.length === 0) {
      onChange((prev) => ({
        ...prev,
        periode: prev.periode || `${currentYear}-01`,
        status: prev.status || "Draft",
        items: [{ kategori: "", deskripsi: "", jumlah: 0 }],
      }));
    }
  }, [budget.items, currentYear, onChange]);

  const handleItemChange = (
    index: number,
    field: keyof BudgetItem,
    value: string | number
  ) => {
    const updatedItems = [...budget.items];

    if (field === "kategori" || field === "deskripsi") {
      updatedItems[index][field] = value as string;
    } else if (field === "jumlah") {
      const parsed = Number(value);
      updatedItems[index][field] = isNaN(parsed) ? 0 : parsed;
    }

    const newTotal = updatedItems.reduce((sum, item) => sum + item.jumlah, 0);
    onChange({ ...budget, items: updatedItems, amount: newTotal });
  };

  const addItemRow = () => {
    const newItem: BudgetItem = { kategori: "", deskripsi: "", jumlah: 0 };
    const updatedItems = [...budget.items, newItem];
    onChange({ ...budget, items: updatedItems });
  };

  const removeItemRow = (index: number) => {
    if (budget.items.length <= 1) return;
    const updatedItems = budget.items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.jumlah, 0);
    onChange({ ...budget, items: updatedItems, amount: newTotal });
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-gray-300 text-gray-700",
    Diajukan: "bg-blue-200 text-blue-800",
    Disetujui: "bg-green-200 text-green-800",
    Ditolak: "bg-red-200 text-red-800",
    Revisi: "bg-yellow-200 text-yellow-800",
    Pending: "bg-purple-200 text-purple-800",
    "Revisi Diminta": "bg-orange-200 text-orange-800",
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Tambah Perencanaan Anggaran</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={onClose}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <Label className="flex-1">
              <span>Bulan</span>
              <Select
                value={budget.periode?.split("-")[1] || ""}
                onChange={(e) =>
                  onChange({
                    ...budget,
                    periode: `${budget.periode?.split("-")[0] || currentYear}-${
                      e.target.value
                    }`,
                  })
                }
              >
                <option value="">Pilih Bulan</option>
                {months.map((month, idx) => (
                  <option key={idx} value={String(idx + 1).padStart(2, "0")}>
                    {month}
                  </option>
                ))}
              </Select>
            </Label>
            <Label className="flex-1">
              <span>Tahun</span>
              <Select
                value={budget.periode?.split("-")[0] || ""}
                onChange={(e) =>
                  onChange({
                    ...budget,
                    periode: `${e.target.value}-${
                      budget.periode?.split("-")[1] || "01"
                    }`,
                  })
                }
              >
                <option value="">Pilih Tahun</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </Label>
          </div>

          <Label>
            <span>Tanggal Pengajuan</span>
            <Input
              value={formatTanggal(budget.tanggalPengajuan)}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </Label>

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

          <div>
            <span className="font-medium">Rincian Anggaran:</span>
            <table className="w-full mt-2 text-sm border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-2 py-1">No</th>
                  <th className="border border-gray-300 px-2 py-1">Kategori</th>
                  <th className="border border-gray-300 px-2 py-1">Deskripsi</th>
                  <th className="border border-gray-300 px-2 py-1">Jumlah (Rp)</th>
                  <th className="border border-gray-300 px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {budget.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Select
                        value={item.kategori}
                        onChange={(e) => handleItemChange(index, "kategori", e.target.value)}
                      >
                        <option value="">Pilih</option>
                        <option value="Operasional">Operasional</option>
                        <option value="Inventaris">Inventaris</option>
                        <option value="Lainnya">Lainnya</option>
                      </Select>
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Input
                        value={item.deskripsi}
                        onChange={(e) => handleItemChange(index, "deskripsi", e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Input
                        type="number"
                        value={item.jumlah === 0 ? "" : item.jumlah}
                        onChange={(e) => handleItemChange(index, "jumlah", e.target.value)}
                        min={0}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <button
                        onClick={() => removeItemRow(index)}
                        disabled={budget.items.length <= 1}
                        className={`text-red-600 border border-red-600 px-3 py-1 rounded-md
                          transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={3} className="text-right px-2 py-1 border border-gray-300">
                    Total
                  </td>
                  <td className="px-2 py-1 border border-gray-300">
                    Rp {budget.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="border border-gray-300"></td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={addItemRow}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Tambah Rincian
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button layout="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={onAdd} disabled={!budget.periode || budget.items.length === 0}>
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
