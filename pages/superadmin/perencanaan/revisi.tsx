import React, { useState } from "react";

type RevisiModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
};

export default function RevisiModal({
  open,
  onClose,
  onSubmit,
}: RevisiModalProps) {
  const [message, setMessage] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() === "") {
      alert("Pesan revisi wajib diisi!");
      return;
    }
    onSubmit(message);
    setMessage("");
  }

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
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4 resize-none overflow-auto"
              rows={4}
              placeholder="Tulis pesan revisi di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  onClose();
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
