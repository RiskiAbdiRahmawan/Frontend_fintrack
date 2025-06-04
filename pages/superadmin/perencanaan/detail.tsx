import React from "react";
import { Button } from "@roketid/windmill-react-ui";

type AlokasiItem = {
  id: number;
  kategori: string;
  keterangan: string;
  jumlah: number;
};

type Perencanaan = {
  id: number;
  periode: string;
  cabang: string;
  status: string;
  diajukanOleh: string;
  tanggalPengajuan: string;
  catatan: string;
  alokasi: AlokasiItem[];
  riwayat?: RiwayatAksi[];
};

type Props = {
  perencanaan: Perencanaan | null;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRevisi: (id: number) => void;
};

type RiwayatAksi = {
  tanggal: string;
  aksi: string;
  oleh: string;
};

function formatRupiah(angka: number) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk memberi kelas warna status
function statusClass(status: string) {
  switch (status) {
    case "Disetujui":
      return "text-green-600 font-semibold";
    case "Ditolak":
      return "text-red-600 font-semibold";
    case "Revisi":
      return "text-yellow-600 font-semibold";
    default:
      return "text-gray-600 font-semibold";
  }
}

const DetailPerencanaanModal: React.FC<Props> = ({
  perencanaan,
  onClose,
  onApprove,
  onReject,
  onRevisi,
}) => {
  if (!perencanaan) return null;

  const totalAnggaran = perencanaan.alokasi.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );

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
              <strong>Periode:</strong> {perencanaan.periode}
            </div>
            <div>
              <strong>Cabang:</strong> {perencanaan.cabang}
            </div>
            <div>
              <strong>Tanggal Pengajuan:</strong> {perencanaan.tanggalPengajuan}
            </div>
            <div>
              <strong>Diajukan oleh:</strong> {perencanaan.diajukanOleh}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span className={statusClass(perencanaan.status)}>
                {perencanaan.status}
              </span>
              {perencanaan.riwayat && perencanaan.riwayat.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Riwayat Status: </h4>
                  <ul className="text-sm text-gray-700 list-disc list-inside">
                    {Array.from(
                      new Map(
                        perencanaan.riwayat.map((item) => [
                          item.tanggal + item.aksi + item.oleh,
                          item,
                        ])
                      ).values()
                    ).map((item, index) => (
                      <li key={index}>
                        <strong>{item.tanggal}:</strong> {item.aksi} oleh{" "}
                        {item.oleh}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              {perencanaan.alokasi.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-2 border border-gray-300">{index + 1}</td>
                  <td className="p-2 border border-gray-300">
                    {item.kategori}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {item.keterangan}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {formatRupiah(item.jumlah)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-100">
                <td
                  colSpan={3}
                  className="p-2 border border-gray-300 text-right"
                >
                  Total
                </td>
                <td className="p-2 border border-gray-300">
                  {formatRupiah(totalAnggaran)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Catatan */}
          <div>
            <strong>Catatan dari Admin:</strong>
            <p className="mt-1 text-gray-700">{perencanaan.catatan}</p>
          </div>
        </div>

        {/* Footer dengan tombol aksi */}
        <div className="flex justify-end p-4 border-t gap-3">
          <Button layout="outline" onClick={onClose}>
            Tutup
          </Button>

          {perencanaan.status === "Diajukan" && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(perencanaan.id)}
              >
                Setujui
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => onReject(perencanaan.id)}
              >
                Tolak
              </Button>
              <Button
                className="bg-yellow-400 hover:bg-yellow-500"
                onClick={() => onRevisi(perencanaan.id)}
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
