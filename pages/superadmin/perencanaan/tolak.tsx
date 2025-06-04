import React, { useState } from "react";

type TolakModalProps = {
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

const alasanOptions = [
  "Dokumen tidak lengkap",
  "Anggaran melebihi batas",
  "Tidak sesuai kebutuhan",
  "Data tidak valid",
  "Lainnya",
];

export default function TolakModal({ onClose, onSubmit }: TolakModalProps) {
  const [selectedAlasan, setSelectedAlasan] = useState(alasanOptions[0]);
  const [alasanLain, setAlasanLain] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let finalReason =
      selectedAlasan === "Lainnya" ? alasanLain.trim() : selectedAlasan;
    if (!finalReason) {
      alert("Mohon isi alasan penolakan.");
      return;
    }
    onSubmit(finalReason);
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[95vw] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Alasan Penolakan</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
            aria-label="Tutup modal"
          >
            &times;
          </button>
        </div>
        <div className="bg-white rounded p-6 w-full overflow-auto">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium">Pilih alasan:</label>
            <select
              value={selectedAlasan}
              onChange={(e) => setSelectedAlasan(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              {alasanOptions.map((alasan) => (
                <option key={alasan} value={alasan}>
                  {alasan}
                </option>
              ))}
            </select>

            {selectedAlasan === "Lainnya" && (
              <>
                <label className="block mb-2 font-medium">
                  Isi alasan lain:
                </label>
                <textarea
                  className="w-full border px-3 py-2 rounded mb-4"
                  rows={3}
                  value={alasanLain}
                  onChange={(e) => setAlasanLain(e.target.value)}
                  placeholder="Tuliskan alasan penolakan"
                />
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Tolak
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
