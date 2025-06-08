import React from "react";
import { Button } from "@roketid/windmill-react-ui";
import { Transaction } from "types/transaction";

type Props = {
  transaction: Transaction | null;
  onClose: () => void;
};

const TransactionDetailModal: React.FC<Props> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-xl font-semibold">Detail Transaksi</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={onClose}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-3 mt-4 p-4">
          <DetailItem label="Kategori" value={transaction.category.name} />
          <DetailItem
            label="Jumlah"
            value={"Rp " + Number(transaction.amount).toLocaleString("id-ID")}
          />
          <DetailItem
            label="Tanggal"
            value={formatDateTime(transaction.transaction_date)}
          />
          <DetailItem label="Tipe" value={transaction.category.type} />
          <DetailItem label="Deskripsi" value={transaction.description ?? ""} />
        </div>
      </div>
    </div>
  );
};

// Komponen kecil untuk baris detail
const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex">
    <div className="w-1/3 font-medium">{label}</div>
    <div className="w-1/12">:</div>
    <div className="font-bold">{value}</div>
  </div>
);

export default TransactionDetailModal;
