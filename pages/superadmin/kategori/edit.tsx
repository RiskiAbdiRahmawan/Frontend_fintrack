import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Label, Select } from "@roketid/windmill-react-ui";
import { Category } from "types/category";
import { updatecategory } from "service/categoryService";

type Props = {
  category?: Category;
  onSuccess: () => void;
  onClose: () => void;
};

const EditCategoryModal: React.FC<Props> = ({
  category,
  onSuccess,
  onClose,
}) => {
  const [categoryName, setCategoryName] = useState(
    category?.category_name ?? ""
  );
  const [categoryType, setCategoryType] = useState<"pemasukan" | "pengeluaran">(
    category?.category_type ?? "pemasukan"
  );
  const [isSubmit, setSubmit] = useState(false);
  const typeOptions = [
    { value: "pemasukan", label: "Pemasukan" },
    { value: "pengeluaran", label: "Pengeluaran" },
  ];
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    setSubmit(true);
    if (!categoryName || !categoryType) {
      alert("Mohon isi semua field wajib(nama dan tipe).");
      setSubmit(false);
      return;
    }

    try {
      await updatecategory(category?.id ?? 0, {
        category_name: categoryName,
        category_type: categoryType,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.log("Gagal menambahkan kategori: ", error);
    } finally {
      if (isMountedRef.current) {
        setSubmit(false);
      }
    }
  };

  if (!category) {
    return <div>Loading Kategori...</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Edit Kategori</h3>
          <button
            className="text-white text-xl hover:text-red-300"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block font-medium">Nama Kategori</label>
            <Input
              name="category_name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Tipe</label>
            <Select
              name="category_type"
              value={categoryType}
              onChange={(e) =>
                setCategoryType(e.target.value as "pemasukan" | "pengeluaran")
              }
              className="mt-1 w-full"
            >
              {typeOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="bg-red-700 text-white hover:bg-red-800"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            className="bg-[#2B3674] text-white hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
