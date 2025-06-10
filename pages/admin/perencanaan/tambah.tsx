import React, { useEffect, useRef, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { Input, Label, Button, Select } from "@roketid/windmill-react-ui";
import { Category } from "types/category";
import { getCategories } from "service/categoryService";
import { CreateBudget, CreateBudgetDetail } from "types/rak";
import { storeBudget, storeBudgetDetail } from "service/rakService";

type Props = {
  rakData?: CreateBudget;
  rakDetailData?: CreateBudgetDetail;
  onClose: () => void;
  onSuccess: () => void;
};

const AddBudgetModal: React.FC<Props> = ({
  rakData,
  rakDetailData,
  onClose,
  onSuccess,
}) => {
  const [period, setPeriod] = useState(rakData?.period ?? "");
  const [submissionDate, setSubmissionDate] = useState(
    rakData?.submission_date ?? ""
  );
  const [budgetDetails, setBudgetDetails] = useState<CreateBudgetDetail[]>([
    {
      budget_id: 0,
      category_id: 0,
      description: "",
      amount: 0,
    },
  ]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [isSubmit, setSubmit] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  const addItemRow = () => {
    const newItem: CreateBudgetDetail = {
      budget_id: 0,
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
    return budgetDetails.reduce((sum, detail) => sum + (detail.amount || 0), 0);
  };

  const handleSubmit = async () => {
    setSubmit(true);

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

    let budgetId = null;

    try {
      // Store budget first
      const budgetResponse = await storeBudget({
        user_id: Number(localStorage.getItem("user_id")),
        branch_id: Number(localStorage.getItem("branch_id")),
        period: period,
        submission_date: submissionDate,
        status: "draf",
      });

      // PERBAIKAN: Sekarang budgetResponse memiliki type RakResponseSingle
      // sehingga budgetResponse.data.id akan tersedia
      if (!budgetResponse || !budgetResponse.data || !budgetResponse.data.id) {
        throw new Error("Invalid response from server - missing budget ID");
      }

      // Ambil budget ID dari struktur response yang benar
      budgetId = budgetResponse.data.id;

      console.log("Budget created with ID:", budgetId); // Debug log

      // Store each budget detail
      for (const detail of budgetDetails) {
        const budgetDetailResponse = await storeBudgetDetail({
          ...detail,
          budget_id: budgetId,
        });
        console.log("Budget detail created:", budgetDetailResponse); // Debug log
      }

      console.log("All budget details created successfully");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal menambahkan perencanaan:", error);
      console.log("budgetId:", budgetId);

      // Berikan error message yang lebih spesifik
      if (error instanceof Error) {
        alert(`Gagal menambahkan perencanaan: ${error.message}`);
      } else {
        alert("Gagal menambahkan perencanaan. Silakan coba lagi.");
      }
    } finally {
      if (isMountedRef.current) {
        setSubmit(false);
      }
    }
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-gray-300 text-gray-700",
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

          <Label>
            <span>Tanggal Pengajuan</span>
            <Input
              type="date"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
            />
          </Label>

          <div className="mt-4">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full font-semibold ${statusColors["Draft"]}`}
            >
              Draft
            </span>
          </div>

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
                        value={detail.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <Input
                        type="number"
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
                        disabled={budgetDetails.length <= 1}
                        className={`text-red-600 border border-red-600 px-3 py-1 rounded-md
                          transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
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
            <Button onClick={handleSubmit} disabled={isSubmit}>
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
