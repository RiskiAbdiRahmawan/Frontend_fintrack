import React from "react";
import { Button } from "@roketid/windmill-react-ui";
import { Category } from "types/category";

type Props = {
  category?: Category;
  onDelete: () => void;
  onClose: () => void;
};

const DeleteCategoryModal: React.FC<Props> = ({
  category,
  onDelete,
  onClose,
}) => {
  const cancelDelete = () => {
    onClose();
  };
  const deletecategory = () => {
    onDelete();
    onClose();
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-2 rounded-t-lg">
          <h3 className="text-lg font-bold">Hapus Kategori</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={cancelDelete}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>
        <div className="p-4">
          <p>
            Apakah Anda yakin ingin menghapus kategori{" "}
            <strong>{category?.category_name}</strong>?
          </p>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-700"
            onClick={cancelDelete}
          >
            Batal
          </Button>
          <Button
            className="bg-red-700 text-white hover:bg-red-800"
            onClick={deletecategory}
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
