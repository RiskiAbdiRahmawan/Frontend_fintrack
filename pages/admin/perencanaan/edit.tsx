import React from "react";
import { Input, Label, Button } from "@roketid/windmill-react-ui";

type Budget = {
  id: number;
  name: string;
  amount: number;
  spent: number;
  Date: Date;
};

type Props = {
  budget?: Budget;
  onChange: (budget: Budget) => void;
  onClose: () => void;
  onSave: () => void;
};

const EditBudgetModal: React.FC<Props> = ({
  budget,
  onChange,
  onClose,
  onSave,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: any;

    if (name === "amount" || name === "spent") {
      newValue = parseInt(value) || 0;
    } else if (name === "Date") {
      newValue = value ? new Date(value) : null; // Jika kosong, bisa set null atau new Date()
    } else {
      newValue = value;
    }

    // onChange({ ...budget, [name]: newValue });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Edit Perencanaan Anggaran</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={onClose}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <Label>
            <span>Nama</span>
            <Input
              name="name"
              value={budget?.name}
              onChange={handleInputChange}
            />
          </Label>

          <Label className="mt-2">
            <span>Jumlah Direncanakan</span>
            <Input
              name="amount"
              type="number"
              value={budget?.amount === 0 ? "" : budget?.amount}
              onChange={handleInputChange}
            />
          </Label>

          <Label className="mt-2">
            <span>Jumlah Dikeluarkan</span>
            <Input
              name="spent"
              type="number"
              value={budget?.spent === 0 ? "" : budget?.spent}
              onChange={handleInputChange}
            />
          </Label>

          <Label className="mt-2">
            <span>Tanggal Pengeluaran Dana</span>
            <Input
              name="Date"
              type="date"
              value={
                budget?.Date ? budget.Date.toISOString().split("T")[0] : ""
              }
              onChange={handleInputChange}
            />
          </Label>

          <div className="mt-4 flex justify-end space-x-2">
            <Button layout="outline" onClick={onClose}>
              Batal
            </Button>
            <Button layout="outline" onClick={onSave}>
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetModal;
