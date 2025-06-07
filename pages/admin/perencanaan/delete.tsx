import React from 'react';
import { Button } from '@roketid/windmill-react-ui';

type Budget = {
  id: number;
  name: string;
  amount: number;
  spent: number;
  Date: Date;
};

type DeleteBudgetModalProps = {
  budget: Budget | null;
  onClose: () => void;
  onDelete: () => void;
};

const DeleteBudgetModal: React.FC<DeleteBudgetModalProps> = ({ budget, onClose, onDelete }) => {
  if (!budget) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Hapus Perencanaan Anggaran</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={onClose}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <p>
              Anda yakin ingin menghapus anggaran <strong>{budget.name}</strong>?
            </p>
            <p className="mt-2 text-gray-600">
              Ini akan menghapus anggaran dan semua data terkait. Aksi ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button layout="outline" onClick={onClose}>
              Batal
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={onDelete}>
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBudgetModal;
