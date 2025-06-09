import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
} from "@roketid/windmill-react-ui";

import {
  EyeIcon,
  PlusIcon,
  PencilIcon as EditIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import Layout from "example/containers/Layout";
import Loader from "example/components/Loader/Loader";
import PageTitle from "example/components/Typography/PageTitle";

import TambahBranchModal from "./tambah";
import EditBranchModal from "./edit";
import DetailBranchModal from "./detail";
import DeleteBranchModal from "./delete";

import {
  Cabang,
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "utils/superadmin/branchData";

const ManajemenCabang = () => {
  const [branches, setBranches] = useState<Cabang[]>([]);
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Cabang | null>(null);
  const [editingBranch, setEditingBranch] = useState<Cabang | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Cabang | null>(null);
  const [addingBranch, setAddingBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({
    branch_code: "",
    branch_name: "",
    branch_address: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const resultsPerPage = 10;

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const data = await getBranches();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async () => {
    try {
      if (
        newBranch.branch_code.trim() === "" ||
        newBranch.branch_name.trim() === "" ||
        newBranch.branch_address.trim() === ""
      ) {
        alert("Semua field wajib diisi!");
        return;
      }

      await createBranch(newBranch);
      await fetchBranches();
      setAddingBranch(false);
      setNewBranch({ branch_code: "", branch_name: "", branch_address: "" });
    } catch (error) {
      console.error("Failed to add branch:", error);
    }
  };

  const saveEdit = async () => {
    if (!editingBranch) return;
    try {
      if (
        editingBranch.branch_code.trim() === "" ||
        editingBranch.branch_name.trim() === "" ||
        editingBranch.branch_address.trim() === ""
      ) {
        alert("Semua field wajib diisi!");
        return;
      }

      await updateBranch(editingBranch.id, editingBranch);
      console.log("Branch dari SaveEdit updated:", editingBranch);
      await fetchBranches();
      setEditingBranch(null);
    } catch (error) {
      console.error("Failed to update branch:", error);
    }
  };

  const handleDeleteBranch = async () => {
    if (!deletingBranch) return;
    try {
      await deleteBranch(deletingBranch.id);
      await fetchBranches();
      setDeletingBranch(null);
    } catch (error) {
      console.error("Failed to delete branch:", error);
    }
  };

  const filteredBranches = branches.filter((branch) =>
    branch.branch_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Pagination slice
  const startIndex = (page - 1) * resultsPerPage;
  const paginatedBranches = filteredBranches.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  return (
    <Layout>
      <PageTitle>Manajemen Cabang</PageTitle>

      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">List Cabang</h3>
        <Button
          size="small"
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
          onClick={() => setAddingBranch(true)}
        >
          <PlusIcon className="w-4 h-4" /> <span>Tambah Cabang</span>
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-b-lg overflow-x-auto">
        <div className="p-4">
          <Input
            placeholder="🔍 Search Cabang"
            className="w-1/3 mb-4"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <TableContainer className="max-w-[1400px] mx-auto overflow-x-auto mb-10">
          <Table>
            <TableHeader>
              <tr className="bg-indigo-100">
                <TableCell>ID</TableCell>
                <TableCell>KODE CABANG</TableCell>
                <TableCell>NAMA CABANG</TableCell>
                <TableCell>ALAMAT</TableCell>
                <TableCell>AKSI</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading...
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : paginatedBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Tidak ada data Cabang.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>{branch.id}</TableCell>
                    <TableCell>{branch.branch_code}</TableCell>
                    <TableCell>{branch.branch_name}</TableCell>
                    <TableCell>{branch.branch_address}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="small"
                          className="bg-blue-700 text-white"
                          onClick={() => setSelectedBranch(branch)}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" /> Lihat
                        </Button>
                        <Button
                          size="small"
                          className="bg-yellow-400 text-black hover:bg-yellow-500"
                          onClick={() => setEditingBranch(branch)}
                        >
                          <EditIcon className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="small"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => setDeletingBranch(branch)}
                        >
                          <TrashIcon className="w-4 h-4 mr-1" /> Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={filteredBranches.length}
              resultsPerPage={resultsPerPage}
              onChange={setPage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      </div>

      {/* Modal Tambah */}
      <TambahBranchModal
        isOpen={addingBranch}
        onClose={() => setAddingBranch(false)}
        onSubmit={handleAddBranch}
        newBranch={newBranch}
        setNewBranch={setNewBranch}
      />

      {/* Modal Edit */}
      {editingBranch && (
        <EditBranchModal
          isOpen={!!editingBranch}
          branch={editingBranch}
          onClose={() => setEditingBranch(null)}
          onSave={saveEdit}
          setBranch={setEditingBranch}
        />
      )}

      {/* Modal Detail */}
      {selectedBranch && (
        <DetailBranchModal
          isOpen={true}
          branch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      )}

      {/* Modal Delete */}
      {deletingBranch && (
        <DeleteBranchModal
          isOpen={true}
          branch={deletingBranch}
          onClose={() => setDeletingBranch(null)}
          onDelete={handleDeleteBranch}
        />
      )}
    </Layout>
  );
};

export default ManajemenCabang;
