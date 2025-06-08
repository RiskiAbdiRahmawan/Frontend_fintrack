import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Label, Select } from "@roketid/windmill-react-ui";
import { User } from "types/user";
import { updateUser } from "service/userService";
import { Branch } from "types/branch";
import { getbranches } from "service/branchService";

type Props = {
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
};

const EditUserModal: React.FC<Props> = ({ user, onClose, onSuccess }) => {
  const [userName, setUserName] = useState(user?.name ?? "");
  const [userEmail, setUserEmail] = useState(user?.email ?? "");
  const [userPassword, setUserPassword] = useState(user?.password ?? "");
  const [allBranch, setAllBranch] = useState<Branch[]>([]);
  const [branchName, setBranchName] = useState(user?.branch.branch_name ?? "");
  const [userRole, setUserRole] = useState(user?.role ?? "");
  const [branchId, setBranchId] = useState<number>(0);
  const [isSubmit, setSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
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

      const matched = data.find((brch) => brch.branch_name === branchName);
      if (matched) {
        setBranchId(matched.id);
      }
    });
  }, [allBranch, user?.branch.branch_name]);

  const handleSubmit = async () => {
    setSubmit(true);
    if (!branchId || !userName || !userEmail) {
      alert("Mohon isi semua field wajib (cabang, nama, email).");
      setSubmit(false);
      return;
    }

    try {
      await updateUser(user?.id ?? 0, {
        branch_id: branchId,
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal update user: ", error);
    } finally {
      if (isMountedRef.current) {
        setSubmit(false);
      }
    }
  };

  if (!user) {
    return <div>Loading transaksi...</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-4 rounded-t-lg sticky top-0 z-10">
          <h3 className="text-lg font-bold">Edit User</h3>
          <button
            className="text-white hover:text-gray-300 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Role */}
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

          {/* Branch */}
          <div>
            <Label className="block font-medium mb-1">Cabang</Label>
            <Select
              name="branch_id"
              value={branchId}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const selectedBranch = allBranch.find(
                  (brch) => brch.id === selectedId
                );

                setBranchId(selectedId);
                setBranchName(selectedBranch?.branch_name || "");
              }}
              className="mt-1 w-full"
            >
              <option value={0}>Select Cabang</option>
              {allBranch.map((brch) => (
                <option key={brch.id} value={brch.id}>
                  {brch.branch_name}
                </option>
              ))}
            </Select>
          </div>

          {/* Name */}
          <div>
            <Label className="block font-medium mb-1">Name</Label>
            <Input
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 w-full"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="block font-medium mb-1">Email</Label>
            <Input
              name="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mt-1 w-full"
            />
          </div>

          {/* Password */}
          <div>
            <Label className="block font-medium mb-1">Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="mt-1 w-full pr-10"
                placeholder="Leave blank to keep current password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <span className="text-sm">Hide</span>
                ) : (
                  <span className="text-sm">Show</span>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters. Leave blank to keep current password.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t sticky bottom-0 bg-white">
          <Button
            layout="outline"
            className="border-red-600 text-red-600 hover:border-red-700 hover:text-red-700"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            className="bg-[#2B3674] hover:bg-[#1e2a5a] text-white"
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
