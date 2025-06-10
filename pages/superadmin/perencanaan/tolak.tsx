import { Button } from "@roketid/windmill-react-ui";
import React, { useState } from "react";
import { deflate } from "zlib";

type Props = {
  onClose: () => void;
  onSubmit: (note: string) => void;
};

const TolakModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      alert("Mohon isi alasan penolakan.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(note);
      setNote("");
      onClose();
    } catch (error) {
      console.log("error submitting rejection: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[95vw] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Tolak Pengajuan</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
            aria-label="Tutup modal"
          >
            &times;
          </button>
        </div>
        <div className="bg-white rounded p-6 w-full overflow-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Masukkan alasan penolakan..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                maxLength={255}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {note.length}/255 karakter
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                layout="outline"
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={loading || !note.trim()}
              >
                {loading ? "Menolak..." : "Tolak Pengajuan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TolakModal;
