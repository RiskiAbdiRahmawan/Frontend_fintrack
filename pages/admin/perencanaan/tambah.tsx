import React from "react";
import { Dispatch, SetStateAction } from "react";
import { Input, Label, Button } from "@roketid/windmill-react-ui";

type Budget = {
  id: number;
  name: string;
  amount: number;
  Date: Date;
  spent: number;
};

type Props = {
  budget?: Budget;
  onChange: Dispatch<SetStateAction<Budget>>;
  onClose: () => void;
  onAdd: () => void;
};

const AddBudgetModal: React.FC<Props> = ({
  budget,
  onChange,
  onClose,
  onAdd,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === "amount" ? parseInt(value) : value;
    // onChange({ ...budget, [name]: newValue });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
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
              value={budget?.amount === 0 ? "" : budget?.amount} // Menampilkan kosong jika 0
              onChange={handleInputChange}
            />
          </Label>

          <div className="mt-4 flex justify-end space-x-2">
            <Button layout="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              className="bg-[#2B3674] text-white hover:bg-blue-700"
              onClick={onAdd}
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
