import React from "react";
import { Button } from "@roketid/windmill-react-ui";
import { RakResponseDetail } from "types/rak";

type Props = {
  perencanaan: RakResponseDetail | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAjukan: () => void;
  isEditable?: boolean;
  isDeletable?: boolean;
};

const DetailBudgetModal: React.FC<Props> = ({
  perencanaan,
  onClose,
  onEdit,
  onDelete,
  onAjukan,
}) => {
  if (!perencanaan) {
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

  const isEditable =
    perencanaan.data.total_amount &&
    ["draf", "revisi"].includes(perencanaan.data.status);
  const isDeletable = perencanaan.data.status === "draf";

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-60 z-50 p-5">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[700px] max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Detail Perencanaan Anggaran</h3>
        </div>

        {/* Info umum */}
        <div className="p-6 text-gray-800 space-y-2">
          <div>
            <strong>Periode:</strong> {perencanaan.data.period}
          </div>
          <div>
            <strong>Status:</strong> {perencanaan.data.status}
          </div>
          <div>
            <strong>Tanggal Pengajuan:</strong>{" "}
            {new Date(perencanaan.data.submission_date).toLocaleDateString(
              "id-ID"
            )}
          </div>
        </div>

        {/* Tabel anggaran */}
        <div className="overflow-x-auto px-6">
          <table className="table-auto w-full border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-1 text-center">
                  No
                </th>
                <th className="border border-gray-300 px-3 py-1 text-left">
                  Kategori
                </th>
                <th className="border border-gray-300 px-3 py-1 text-left">
                  Keterangan Detail
                </th>
                <th className="border border-gray-300 px-3 py-1 text-right">
                  Jumlah (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {perencanaan.data.detail.map((rak, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-1 text-center">
                    {i + 1}
                  </td>
                  <td className="border border-gray-300 px-3 py-1">
                    {rak.category.name}
                  </td>
                  <td className="border border-gray-300 px-3 py-1">
                    {rak.description}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-right">
                    Rp {rak.amount.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-100">
                <td
                  colSpan={3}
                  className="border border-gray-300 px-3 py-1 text-right"
                >
                  Total
                </td>
                <td className="border border-gray-300 px-3 py-1 text-right">
                  Rp {perencanaan.data.total_amount.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Catatan */}
        {perencanaan.data.revision_note && (
          <div className="px-6 py-4">
            <div className="px-5 py-2 border-l-8 border-blue-400 bg-blue-100 text-black rounded-md shadow-sm">
              <strong className="block mb-1">Catatan dari Admin:</strong>
              <p className="italic">{perencanaan.data.revision_note}</p>
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
            <>
              <Button
                onClick={onAjukan}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ajukan
              </Button>
              <Button
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Hapus
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailBudgetModal;
