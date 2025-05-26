import React, { useState, useEffect } from "react";
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
import PageTitle from "example/components/Typography/PageTitle";
import {
  getUsers,
  deleteUser,
  getBranches,
  createUser,
  updateUser,
} from "utils/superadmin/userData";
import AddUserModal from "./tambah";
import EditUserModal from "./edit";
import DetailUserModal from "./detail";
import DeleteUserModal from "./delete";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  branch_id: number;
  branch?: {
    id: number;
    branch_name: string;
  };
};

function ManajemenUser() {
  const [data, setData] = useState<User[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState<boolean>(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    branch_id: 0,
    role: "admin",
  });
  const [isLoading, setIsLoading] = useState(false);

  const resultsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const usersResponse = await getUsers();
      const branchesResponse = await getBranches();
      // const [usersResponse, branchesResponse] = await Promise.all([
      //   getUsers(),
      //   getBranches(),
      // ]);
      console.log("Users:", usersResponse.data);
      console.log("Branches:", branchesResponse.data);
      setData(usersResponse.data);
      setFilteredUsers(usersResponse.data);
      setBranches(branchesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = data.filter((user) =>
    user.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  // useEffect(() => {
  //   const filtered = data.filter((user) =>
  //     user.name.toLowerCase().includes(searchKeyword.toLowerCase())
  //   );
  //   setFilteredUsers(filtered);
  // }, [searchKeyword, data]);

  const startIndex = (page - 1) * resultsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + resultsPerPage);

  const handleAddUser = async () => {
    try {
      await createUser(newUser);
      await fetchData(); // Refresh the data
      setAddingUser(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        branch_id: 0,
        role: "admin",
      });
      setSearchKeyword("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setIsLoading(true);
    try {
      await updateUser(editingUser.id!, editingUser);
      await fetchData(); // Refresh the data
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser.id);
      await fetchData(); // Refresh the data
      setDeletingUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <PageTitle>Manajemen User</PageTitle>

      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">List User</h3>
        <Button
          size="small"
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
          onClick={() => setAddingUser(true)}
        >
          <PlusIcon className="w-4 h-4" /> <span>Tambah User</span>
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-b-lg overflow-x-auto">
        <div className="p-4">
          <Input
            placeholder="🔍 Search User"
            className="w-1/3 mb-4"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <TableContainer className="max-w-[1400px] mx-auto overflow-x-[1400px] mb-10">
          <Table>
            <TableHeader>
              <tr className="bg-indigo-100">
                <TableCell>ID</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>CABANG</TableCell>
                <TableCell>AKSI</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {paginatedData.map((user) => {
                const branch = branches.find(
                  (b) => b.password === user.password
                );
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {branch ? branch.branch_name : "Tidak Ditemukan"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="small"
                          className="bg-blue-700 text-white"
                          onClick={() => setSelectedUser(user)}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" /> Lihat
                        </Button>
                        <Button
                          size="small"
                          className="bg-yellow-400 text-black hover:bg-yellow-500"
                          onClick={() => setEditingUser(user)}
                        >
                          <EditIcon className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="small"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => setDeletingUser(user)}
                        >
                          <TrashIcon className="w-4 h-4 mr-1" /> Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={filteredUsers.length}
              resultsPerPage={resultsPerPage}
              onChange={setPage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      </div>

      {/* Pop-up Tambah User */}
      {addingUser && (
        <AddUserModal
          user={newUser}
          branches={branches}
          onChange={(user) => setNewUser(user as User)}
          onClose={() => setAddingUser(false)}
          onAdd={handleAddUser}
        />
      )}

      {/* Pop-up Edit User */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          branches={branches}
          onChange={(user) => setEditingUser(user as User)}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* Pop-up Detail User */}
      {selectedUser && (
        <DetailUserModal
          user={selectedUser}
          branches={branches}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Pop-up Hapus User */}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDelete={handleDeleteUser}
        />
      )}
    </Layout>
  );
}

export default ManajemenUser;
