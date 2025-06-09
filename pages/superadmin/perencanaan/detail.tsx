import React from "react";
import { Button } from "@roketid/windmill-react-ui";
import { RakResponseDetail, RakDetail } from "types/rak";

type Props = {
  perencanaan: RakResponseDetail | null;
  onClose: () => void;
  onReject: (id: number) => void;
  onApprove: (id: number) => void;
  onRevisi: (id: number) => void;
};

function formatRupiah(angka: number) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function statusClass(status: string) {
  switch (status) {
    case "disetujui":
      return "text-green-600 font-semibold";
    case "ditolak":
      return "text-red-600 font-semibold";
    case "revisi":
      return "text-yellow-600 font-semibold";
    case "diajukan":
      return "text-blue-600 font-semibold";
    default:
      return "text-gray-600 font-semibold";
  }
}

const DetailPerencanaanModal: React.FC<Props> = ({
  perencanaan,
  onClose,
  onReject,
  onApprove,
  onRevisi,
}) => {
  const data = perencanaan?.data;

  if (!data) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[700px] max-w-[95vw] max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Detail Perencanaan Anggaran</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
            aria-label="Tutup modal"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Informasi Utama */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Periode:</strong> {data.period}
            </div>
            <div>
              <strong>Cabang:</strong> {data.branch.name}
            </div>
            <div>
              <strong>Tanggal Pengajuan:</strong> {data.submission_date}
            </div>
            <div>
              <strong>Diajukan oleh:</strong> {data.user.name}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span className={statusClass(data.status)}>{data.status}</span>
              {/* <div className="mt-4">
                <h4 className="font-bold mb-2">Permintaan Revisi: </h4>
                <ul className="text-sm text-gray-700 list-disc list-inside"></ul>
              </div> */}
            </div>
          </div>

          {/* Tabel Alokasi */}
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">No</th>
                <th className="p-2 border border-gray-300">Kategori</th>
                <th className="p-2 border border-gray-300">
                  Keterangan Detail
                </th>
                <th className="p-2 border border-gray-300">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {data.detail.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Tidak ada alokasi anggaran.
                  </td>
                </tr>
              ) : (
                data.detail.map((detail, index) => (
                  <tr
                    key={detail.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-2 border border-gray-300">{index + 1}</td>
                    <td className="p-2 border border-gray-300">
                      {detail.category.name}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {detail.description}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {formatRupiah(detail.amount)}
                    </td>
                  </tr>
                ))
              )}
              <tr className="font-semibold bg-gray-100">
                <td
                  colSpan={3}
                  className="p-2 border border-gray-300 text-right"
                >
                  Total
                </td>
                <td className="p-2 border border-gray-300">
                  {formatRupiah(data.total_amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer dengan tombol aksi */}
        <div className="flex justify-end p-4 border-t gap-3">
          <Button layout="outline" onClick={onClose}>
            Tutup
          </Button>

          {data.status === "diajukan" && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(data.id)}
              >
                Setujui
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => onReject(data.id)}
              >
                Tolak
              </Button>
              <Button
                className="bg-yellow-400 hover:bg-yellow-500"
                onClick={() => onRevisi(data.id)}
              >
                Minta Revisi
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPerencanaanModal;
