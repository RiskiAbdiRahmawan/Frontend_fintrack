import React from "react";
import { Button } from "@roketid/windmill-react-ui";
import { Category } from "types/category";

type Props = {
  category: Category | null;
  onClose: () => void;
};

const DetailCategoryModal: React.FC<Props> = ({ category, onClose }) => {
  if (!category) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Detail Kategori</h3>
          <button
            className="text-white text-xl hover:text-red-300"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4 space-y-2">
          <p>
            <strong>ID:</strong> {category.id}
          </p>
          <p>
            <strong>Nama:</strong> {category.category_name}
          </p>
          <p>
            <strong>Tipe:</strong> {category.category_type}
          </p>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="bg-[#2B3674] text-white hover:bg-blue-700"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailCategoryModal;
