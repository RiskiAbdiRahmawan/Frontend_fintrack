import React from "react";
import { Button } from "@roketid/windmill-react-ui";
import { Budget } from "./type";

type Props = {
  budget: Budget;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditable?: boolean;
  isDeletable?: boolean;
};

const DetailBudgetModal: React.FC<Props> = ({
  budget,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!budget) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-[600px] p-6">
          <p className="text-center text-gray-700 font-semibold">
            Data anggaran tidak tersedia.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={onClose}>Tutup</Button>
          </div>
        </div>
      </div>
    );
  }

  const totalJumlah = budget.items.reduce((sum, item) => sum + item.jumlah, 0);
  const isEditable = budget.status && ["Draft", "Ditolak", "Revisi Diminta"].includes(budget.status);
  const isDeletable = budget.status === "Draft";



  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-60 z-50 p-5">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[700px] max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Detail Perencanaan Anggaran</h3>
        </div>

        {/* Info umum */}
        <div className="p-6 text-gray-800 space-y-2">
          <div><strong>Periode:</strong> {budget.periode}</div>
          <div><strong>Status:</strong> {budget.status}</div>
          <div>
            <strong>Tanggal Pengajuan:</strong>{" "}
            {new Date(budget.tanggalPengajuan).toLocaleDateString("id-ID")}
          </div>
        </div>

        {/* Tabel anggaran */}
        <div className="overflow-x-auto px-6">
          <table className="table-auto w-full border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-1 text-center">No</th>
                <th className="border border-gray-300 px-3 py-1 text-left">Kategori</th>
                <th className="border border-gray-300 px-3 py-1 text-left">Keterangan Detail</th>
                <th className="border border-gray-300 px-3 py-1 text-right">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {budget.items.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-1 text-center">{i + 1}</td>
                  <td className="border border-gray-300 px-3 py-1">{item.kategori}</td>
                  <td className="border border-gray-300 px-3 py-1">{item.deskripsi}</td>
                  <td className="border border-gray-300 px-3 py-1 text-right">
                    Rp {item.jumlah.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-100">
                <td colSpan={3} className="border border-gray-300 px-3 py-1 text-right">
                  Total
                </td>
                <td className="border border-gray-300 px-3 py-1 text-right">
                  Rp {totalJumlah.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Catatan */}
        {budget.catatanAdmin && (
          <div className="px-6 py-4">
            <div className="px-5 py-2 border-l-8 border-blue-400 bg-blue-100 text-black rounded-md shadow-sm">
              <strong className="block mb-1">Catatan dari Admin:</strong>
              <p className="italic">{budget.catatanAdmin}</p>
            </div>
          </div>
        )}

        {/* Footer tombol aksi */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-blue-200">
          <Button layout="outline" onClick={onClose}>
            Tutup
          </Button>

          {isEditable && (
            <Button
              onClick={onEdit}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
            >
              Edit
            </Button>
          )}

          {isDeletable && (
            <Button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailBudgetModal;