import React, { useState } from "react";
import { Button } from "@roketid/windmill-react-ui";
import { User } from "types/user";

type Props = {
  user: User | null;
  onClose: () => void;
};

const DetailUserModal: React.FC<Props> = ({ user, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Password ditampilkan dengan simbol atau bintang
  const displayPassword = showPassword ? "********" : "••••••••";

  if (!user) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[95vw]">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Detail Pengguna</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
            aria-label="Tutup modal"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          {[
            { label: "ID", value: user.id },
            { label: "Nama", value: user.name },
            { label: "Email", value: user.email },
            {
              label: "Role",
              value: user.role.replace("_", " ").toUpperCase(),
            },
            {
              label: "Cabang",
              value: user.branch.branch_name,
            },
          ].map(({ label, value }) => (
            <div key={label} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-3 font-medium text-gray-700">
                {label}
              </div>
              <div className="col-span-1">:</div>
              <div className="col-span-8 font-semibold">{value}</div>
            </div>
          ))}

          {/* Password */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-3 font-medium text-gray-700">Password</div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex items-center gap-2">
              <span className="font-semibold">{displayPassword}</span>
              <Button
                size="small"
                layout="outline"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs py-1 px-2"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <Button
            className="bg-[#2B3674] hover:bg-[#1e2a5a] text-white"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailUserModal;
