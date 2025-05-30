import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Label, Select } from "@roketid/windmill-react-ui";
import { createUser } from "service/userService";
import { CreateUser } from "types/user";
import { getbranches } from "service/branchService";
import { Branch } from "types/branch";

type Props = {
  user?: CreateUser;
  onClose: () => void;
  onSuccess: () => void;
};

const AddUserModal: React.FC<Props> = ({ user, onClose, onSuccess }) => {
  const [userName, setUserName] = useState(user?.name ?? "");
  const [userEmail, setUserEmail] = useState(user?.email ?? "");
  const [userPassword, setUserPassword] = useState(user?.password ?? "");
  const [userRole, setUserRole] = useState(user?.role ?? "admin");
  const [allBranch, setAllBranch] = useState<Branch[]>([]);
  const [branchName, setBranchName] = useState<string>("");
  const [branchId, setBranchId] = useState<number>(0);
  const [isSubmit, setSubmit] = useState(false);
  const roleOptions = [
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
  ];
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    getbranches().then((data: Branch[]) => {
      setAllBranch(data);
    });
  }, []);

  const handleSubmit = async () => {
    setSubmit(true);
    if (!branchId || !userName || !userEmail || !userPassword) {
      alert("Mohon isi semua field wajib (cabang, nama, email, dan password).");
      setSubmit(false);
      return;
    }

    try {
      await createUser({
        branch_id: branchId,
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal menambahkan pengguna: ", error);
    } finally {
      if (isMountedRef.current) {
        setSubmit(false);
      }
    }
  };

  if (!user) {
    return null;
  }

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
            <Label className="block font-medium mb-1">Role</Label>
            <Select
              name="role"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="mt-1 w-full"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block font-medium">Cabang</label>
            <select
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              value={branchId}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const selectedBranch = allBranch.find(
                  (brch) => brch.id === selectedId
                );

                setBranchId(selectedId);
                setBranchName(selectedBranch?.branch_name || "");
              }}
            >
              <option value={0}>-- Pilih Cabang --</option>
              {allBranch.map((brch) => (
                <option key={brch.id} value={brch.id}>
                  {brch.branch_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Nama</label>
            <Input
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <Input
              name="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <Input
              name="password"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
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
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            Tambah
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
