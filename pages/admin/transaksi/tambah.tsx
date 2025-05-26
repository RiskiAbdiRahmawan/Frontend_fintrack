import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "@roketid/windmill-react-ui";
import { CreateTransaction } from "types/transaction";
import { createTransaction } from "service/transactionService";
import { Category } from "types/category";
import { getCategories } from "service/categoryService";

type Props = {
  transaction: CreateTransaction;
  onClose: () => void;
  onSuccess: () => void;
};

const AddTransactionModal: React.FC<Props> = ({
  transaction,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);
  const [transactionDate, setTransactionDate] = useState(
    transaction.transaction_date
  );
  const [categoryType, setCategoryType] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [isSubmit, setSubmit] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    getCategories().then((data: Category[]) => {
      setAllCategory(data);
    });
  }, []);

  const filteredCategories = allCategory.filter(
    (cat) => cat.category_type === categoryType
  );

  const handleSubmit = async () => {
    setSubmit(true);
    if (!categoryId || !amount || !transactionDate) {
      alert("Mohon isi semua field wajib (kategori, jumlah, dan tanggal).");
      setSubmit(false);
      return;
    }

    const now = new Date();
    const formatterTime = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const timeInJakarta = formatterTime.format(now);
    const currentTime = timeInJakarta.replaceAll(".", ":");
    const formatDate = transactionDate + " " + currentTime;

    // console.log("Payload:", {
    //   transaction_date: formatDate,
    // });
    try {
      await createTransaction({
        user_id: Number(localStorage.getItem("user_id")),
        branch_id: Number(localStorage.getItem("branch_id")),
        category_id: categoryId,
        amount: amount,
        transaction_date: formatDate,
        description,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Gagal add transaksi:", err);
    } finally {
      if (isMountedRef.current) {
        setSubmit(false);
      }
    }
  };

  if (!transaction) {
    return <div>Loading transaksi...</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Tambah Transaksi</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={onClose}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>

        {/* Form Fields */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block font-medium mb-1">Tipe</label>
            <select
              className="w-full mt-1 border-gray-300 rounded-md"
              name="type"
              value={categoryType}
              onChange={(e) => {
                setCategoryType(e.target.value);
                setCategoryId(0);
              }}
            >
              <option value="">-- Pilih Tipe --</option>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Kategori</label>
            <select
              className="w-full mt-1 border-gray-300 rounded-md"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              disabled={!categoryType}
            >
              <option value="">-- Pilih Kategori --</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Jumlah</label>
            <Input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium">Tanggal</label>
            <Input
              type="date"
              name="transactionDate"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Deskripsi</label>
            <Input
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="bg-red-700 text-white hover:bg-[#FF0404]"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            disabled={isSubmit}
            className="bg-[#2B3674] text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Tambah
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
