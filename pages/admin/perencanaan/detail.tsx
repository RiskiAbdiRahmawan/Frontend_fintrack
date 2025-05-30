import React from "react";
import { Button } from "@roketid/windmill-react-ui";

type Budget = {
  id: number;
  name: string;
  amount: number;
  spent: number;
  Date: Date;
};

type Props = {
  budget: Budget | null;
  onClose: () => void;
};

const DetailBudgetModal: React.FC<Props> = ({ budget, onClose }) => {
  if (!budget) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-[500px] p-4">
          <p className="text-center text-gray-700">
            Data anggaran tidak tersedia.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={onClose}>Tutup</Button>
          </div>
        </div>
      </div>
    );
  }

  const selisih = budget.amount - budget.spent;
  const persentase =
    budget.amount > 0 ? ((selisih / budget.amount) * 100).toFixed(2) : "0.00";

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Detail Perencanaan Anggaran</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={onClose}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-y-3">
          <div className="font-semibold text-gray-700">Nama:</div>
          <div>: {budget.name}</div>

          <div className="font-semibold text-gray-700">
            Jumlah Direncanakan:
          </div>
          <div>: Rp {budget.amount.toLocaleString()}</div>

          <div className="font-semibold text-gray-700">Jumlah Dikeluarkan:</div>
          <div>: Rp {budget.spent.toLocaleString()}</div>

          <div className="font-semibold text-gray-700">Selisih:</div>
          <div>: Rp {selisih.toLocaleString()}</div>

          <div className="font-semibold text-gray-700">Persentase:</div>
          <div>: {persentase}%</div>

          <div className="font-semibold text-gray-700">
            Tanggal Pengeluaran Dana:
          </div>
          <div>
            : {budget.Date ? budget.Date.toLocaleDateString("id-ID") : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBudgetModal;
