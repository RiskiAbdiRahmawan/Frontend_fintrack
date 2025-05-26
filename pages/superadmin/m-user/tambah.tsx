import React from "react";
import { Button, Input } from "@roketid/windmill-react-ui";

type Branch = {
  id: number;
  branch_name: string;
};

type User = {
  name: string;
  email: string;
  password: string;
  branch_id: number;
  role: string;
};

type AddUserModalProps = {
  user?: User;
  branches: Branch[];
  onChange: (user: Partial<User>) => void;
  onAdd: () => void;
  onClose: () => void;
};

const AddUserModal: React.FC<AddUserModalProps> = ({
  user,
  branches,
  onChange,
  onAdd,
  onClose,
}) => {
  const isDisabled =
    !user?.name || !user?.email || !user?.password || !user?.branch_id;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px]">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-3 rounded-t-lg">
          <h3 className="text-lg font-bold">Tambah User</h3>
          <button
            className="text-white text-xl hover:text-red-300"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Form Input */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block font-medium">Cabang</label>
            <select
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              value={user?.branch_id}
              onChange={(e) =>
                onChange({ ...(user || {}), branch_id: Number(e.target.value) })
              }
            >
              <option value={0}>-- Pilih Cabang --</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Nama</label>
            <Input
              name="name"
              value={user?.name}
              onChange={(e) => onChange({ ...user, name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <Input
              name="email"
              type="email"
              value={user?.email}
              onChange={(e) => onChange({ ...user, email: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <Input
              name="password"
              type="password"
              value={user?.password}
              onChange={(e) => onChange({ ...user, password: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="bg-red-700 text-white hover:bg-red-800"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            className="bg-[#2B3674] text-white hover:bg-blue-700"
            onClick={onAdd}
            disabled={isDisabled}
          >
            Tambah
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
