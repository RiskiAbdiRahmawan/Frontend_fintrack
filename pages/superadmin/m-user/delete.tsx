import React from "react";
import { Button } from "@roketid/windmill-react-ui";
import { User } from "types/user";

type DeleteUserModalProps = {
  user?: User;
  onDelete: () => void;
  onClose: () => void;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  onDelete,
  onClose,
}) => {
  // Function to handle cancellation
  const cancelDelete = () => {
    onClose(); // Trigger onClose to close the modal
  };

  // Function to handle deletion
  const deleteUser = () => {
    onDelete(); // Trigger the onDelete function passed from the parent component
    onClose(); // Close the modal after deleting
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        <div className="flex justify-between items-center bg-[#2B3674] text-white p-2 rounded-t-lg">
          <h3 className="text-lg font-bold">Hapus User</h3>
          <Button
            className="bg-transparent text-white hover:bg-transparent hover:text-white"
            onClick={cancelDelete}
          >
            <span className="text-xl">×</span>
          </Button>
        </div>
        <div className="p-4">
          <p>
            Apakah Anda yakin ingin menghapus pengguna{" "}
            <strong>{user?.name}</strong>?
          </p>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-700"
            onClick={cancelDelete}
          >
            Batal
          </Button>
          <Button
            className="bg-red-700 text-white hover:bg-red-800"
            onClick={deleteUser}
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
