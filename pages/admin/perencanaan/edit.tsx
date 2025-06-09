import React, { useEffect, useRef, useState } from "react";
import { Input, Label, Button, Select } from "@roketid/windmill-react-ui";
import { RakResponseDetail, CreateBudgetDetail } from "types/rak";
import { Category } from "types/category";
import { getCategories } from "service/categoryService";
import { deleteRakByBranch, storeBudgetDetail } from "service/rakService";

type Props = {
  budget: RakResponseDetail;
  onClose: () => void;
  onSuccess: () => void;
  loading?: boolean;
};

const EditBudgetModal: React.FC<Props> = ({
  budget,
  onClose,
  onSuccess,
  loading = false,
}) => {
  const [period, setPeriod] = useState(budget?.data?.period || "");
  const [submissionDate, setSubmissionDate] = useState(
    budget?.data?.submission_date || ""
  );
  const [budgetDetails, setBudgetDetails] = useState<CreateBudgetDetail[]>([]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [isSubmit, setSubmit] = useState(false);
  const isMountedRef = useRef(true);

  const months = [
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Move all useEffect hooks here, before any conditional returns
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const pengeluaranCategories = response.filter(
          (category: Category) => category.category_type === "pengeluaran"
        );
        setAllCategory(pengeluaranCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (budget?.data?.detail && budget.data.detail.length > 0) {
      const initialDetails = budget.data.detail.map((detail) => ({
        budget_id: budget.data.id,
        category_id: detail.category.id,
        description: detail.description,
        amount: detail.amount,
      }));
      setBudgetDetails(initialDetails);
    } else {
      // If no details, create one empty row
      setBudgetDetails([
        {
          budget_id: budget?.data?.id || 0,
          category_id: 0,
          description: "",
          amount: 0,
        },
      ]);
    }
  }, [budget]);

  // Add check for budget existence after all hooks
  if (!budget || !budget.data) {
    return null;
  }

  // Fungsi untuk parsing angka dari string yang mungkin mengandung koma
  const parseNumber = (value: string | number): number => {
    if (typeof value === "number") {
      return isNaN(value) ? 0 : value;
    }

    if (typeof value === "string") {
      // Hapus semua karakter non-digit kecuali titik dan minus
      const cleaned = value.replace(/[^0-9.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  // Fungsi untuk format angka dengan koma sebagai pemisah ribuan
  const formatNumber = (value: number): string => {
    return value.toLocaleString("id-ID");
  };

  const isEditable = ["draf", "revisi"].includes(
    budget.data.status?.toLowerCase() || ""
  );

  const addItemRow = () => {
    const newItem: CreateBudgetDetail = {
      budget_id: budget.data.id,
      category_id: 0,
      description: "",
      amount: 0,
    };
    setBudgetDetails([...budgetDetails, newItem]);
  };

  const removeItemRow = (index: number) => {
    if (budgetDetails.length <= 1) return;
    const updatedItems = budgetDetails.filter((_, i) => i !== index);
    setBudgetDetails(updatedItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof CreateBudgetDetail,
    value: any
  ) => {
    const updatedDetails = [...budgetDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: field === "amount" ? Number(value) : value,
    };
    setBudgetDetails(updatedDetails);
  };

  const getTotalAmount = () => {
    return budgetDetails.reduce((sum, detail) => {
      const amount = parseNumber(detail.amount || 0);
      return sum + amount;
    }, 0);
  };

  const formatDateForInput = (date: unknown): string => {
    if (!date) return "";

    if (typeof date === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().slice(0, 10);
      }
    }

    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }

    if (typeof date === "number") {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toISOString().slice(0, 10);
      }
    }

    return "";
  };

  const handleSubmitWithStatus = async (status: string) => {
    setSubmit(true);

    // Validasi
    if (!period || !submissionDate) {
      alert("Mohon isi periode dan tanggal pengajuan");
      setSubmit(false);
      return;
    }

    if (
      budgetDetails.some(
        (detail) => !detail.category_id || !detail.description || !detail.amount
      )
    ) {
      alert("Mohon lengkapi semua rincian anggaran");
      setSubmit(false);
      return;
    }

    try {
      // Step 1: Delete existing budget details
      console.log(
        "Deleting existing budget details for budget ID:",
        budget.data.id
      );
      await deleteRakByBranch(budget.data.id);

      // Step 2: Create new budget details
      console.log("Creating new budget details:", budgetDetails);
      for (const detail of budgetDetails) {
        const budgetDetailResponse = await storeBudgetDetail({
          ...detail,
          budget_id: budget.data.id,
        });
        console.log("Budget detail created:", budgetDetailResponse);
      }

      console.log("All budget details updated successfully");

      onSuccess();
      onClose();
      alert("Budget berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal memperbarui perencanaan:", error);

      if (error instanceof Error) {
        alert(`Gagal memperbarui perencanaan: ${error.message}`);
      } else {
        alert("Gagal memperbarui perencanaan. Silakan coba lagi.");
      }
    } finally {
      if (isMountedRef.current) {
        setSubmit(false);
      }
    }
  };

  const statusColors: Record<string, string> = {
    draf: "bg-gray-300 text-gray-700",
    diajukan: "bg-blue-200 text-blue-800",
    revisi: "bg-yellow-200 text-yellow-800",
    ditolak: "bg-red-200 text-red-800",
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
          {budget.data.revision_note && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
              <strong>Catatan Admin:</strong>
              <p className="mt-1 whitespace-pre-line">
                {budget.data.revision_note}
              </p>
            </div>
          )}

          {/* Periode */}
          <div className="flex gap-4">
            <Label className="flex-1">
              <span>Bulan</span>
              <Select
                disabled={true}
                value={period?.split("-")[1] || ""}
                onChange={(e) => {
                  const bulan = e.target.value.padStart(2, "0");
                  const tahun = period?.split("-")[0] || currentYear.toString();
                  setPeriod(`${tahun}-${bulan}`);
                }}
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
                disabled={true}
                value={period?.split("-")[0] || ""}
                onChange={(e) => {
                  const tahun = e.target.value;
                  const bulan = period?.split("-")[1] || "01";
                  setPeriod(`${tahun}-${bulan}`);
                }}
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

          {/* Tanggal Pengajuan */}
          <Label>
            <span>Tanggal Pengajuan</span>
            <Input
              type="date"
              disabled={true}
              value={formatDateForInput(submissionDate)}
              onChange={(e) => setSubmissionDate(e.target.value)}
            />
          </Label>

          {/* Status */}
          <div className="mt-4">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full font-semibold ${
                statusColors[budget.data.status?.toLowerCase() || "draf"]
              }`}
            >
              {budget.data.status || "Draft"}
            </span>
          </div>

          {/* Tabel Rincian */}
          <div>
            <span className="font-medium">Rincian Anggaran:</span>
            <table className="w-full mt-2 text-sm border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-2 py-1">No</th>
                  <th className="border border-gray-300 px-2 py-1">Kategori</th>
                  <th className="border border-gray-300 px-2 py-1">
                    Deskripsi
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    Jumlah (Rp)
                  </th>
                  <th className="border border-gray-300 px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {budgetDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Select
                        disabled={!isEditable || isSubmit}
                        value={detail.category_id}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "category_id",
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value="">Pilih Kategori</option>
                        {allCategory.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Input
                        disabled={!isEditable || isSubmit}
                        value={detail.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Input
                        type="number"
                        disabled={!isEditable || isSubmit}
                        value={detail.amount === 0 ? "" : detail.amount}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "amount",
                            Number(e.target.value)
                          )
                        }
                        min={0}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <button
                        onClick={() => removeItemRow(index)}
                        disabled={
                          budgetDetails.length <= 1 || !isEditable || isSubmit
                        }
                        className="text-red-600 border border-red-600 px-3 py-1 rounded-md transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td
                    colSpan={3}
                    className="text-right px-2 py-1 border border-gray-300"
                  >
                    Total
                  </td>
                  <td className="px-2 py-1 border border-gray-300">
                    Rp {getTotalAmount().toLocaleString("id-ID")}
                  </td>
                  <td className="border border-gray-300"></td>
                </tr>
              </tbody>
            </table>
            {isEditable && (
              <button
                onClick={addItemRow}
                disabled={isSubmit}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Tambah Rincian
              </button>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 p-4 rounded-b-lg">
            <Button
              layout="outline"
              onClick={onClose}
              className="mr-auto border-blue-900 text-blue-900 hover:bg-blue-100"
              disabled={isSubmit}
            >
              Batal
            </Button>
            {isEditable && (
              <>
                <Button
                  onClick={() => handleSubmitWithStatus("draf")}
                  className="bg-gray-600 text-white hover:bg-gray-700"
                  disabled={isSubmit}
                >
                  {isSubmit ? "Menyimpan..." : "Simpan Draft"}
                </Button>
                <Button
                  onClick={() => handleSubmitWithStatus("diajukan")}
                  className="bg-blue-900 text-white hover:bg-blue-800"
                  disabled={isSubmit}
                >
                  {isSubmit ? "Mengajukan..." : "Ajukan"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetModal;
