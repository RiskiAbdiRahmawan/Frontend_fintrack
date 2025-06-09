import { Button } from "@roketid/windmill-react-ui";
import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
};

const RevisiModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      alert("Catatan revisi harus diisi");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(note);
      setNote("");
      onClose();
    } catch (error) {
      console.error("Error submitting revision:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[95vw] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Minta Revisi</h3>
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
                Catatan Revisi <span className="text-red-500">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Masukkan catatan revisi..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={4}
                maxLength={500}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {note.length}/500 karakter
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">
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
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={loading || !note.trim()}
              >
                {loading ? "Mengirim..." : "Kirim Revisi"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RevisiModal;
