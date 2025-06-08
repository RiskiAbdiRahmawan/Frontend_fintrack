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
import Loader from "example/components/Loader/Loader";
import PageTitle from "example/components/Typography/PageTitle";
import AddUserModal from "./tambah";
import EditUserModal from "./edit";
import DetailUserModal from "./detail";
import DeleteUserModal from "./delete";
import { getUsers, getUserById, deleteUser } from "service/userService";
import { CreateUser, User } from "types/user";

function ManajemenUser() {
  //detail
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openUserDetails = async (id: number) => {
    try {
      const user = await getUserById(id);
      setSelectedUser(user);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Gagal mengambil detail pengguna: ", error);
    }
  };
  const closeUserDetails = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // add
  const [addingUser, setAddingUser] = useState(false);
  const handleAdd = () => {
    setAddingUser(true);
  };
  const closeAddModal = () => {
    setAddingUser(false);
  };
  const initialUser: CreateUser = {
    branch_id: 0,
    name: "",
    email: "",
    password: "",
    role: "",
  };

  // edit
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const handleEdit = (user: User) => {
    setEditingUser(user);
  };
  const closeEditModel = () => {
    setEditingUser(null);
  };

  // delete
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser.id);
      getUsers().then((res) => {
        setAllUsers(res.data);
        setTotalUsers(res.meta.total);
      });
      setDeletingUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // index
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [page, setPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const usersResponse = await getUsers();
      setAllUsers(usersResponse.data);
      setTotalUsers(usersResponse.meta.total);
    } catch (error) {
      console.error("Error fetching Users: ", error);
      setError("Gagal mengambil data pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = allUsers.filter((usr) =>
        usr.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      const startIndex = (page - 1) * resultsPerPage;
      const Pagination = filtered.slice(
        startIndex,
        startIndex + resultsPerPage
      );

      setUsers(Pagination);
      setTotalUsers(filtered.length);
    }, 300);
    return () => clearTimeout(timeout);
  }, [allUsers, searchKeyword, page, resultsPerPage]);

  if (error) return <p className="tex;t-red-500">{error}</p>;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Layout>
      <PageTitle>Manajemen User</PageTitle>

      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">List User</h3>
        <Button
          size="small"
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
          onClick={() => handleAdd()}
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
                <TableCell>ROLE</TableCell>
                <TableCell>CABANG</TableCell>
                <TableCell>AKSI</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Tidak ada data pengguna.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((usr, index) => {
                  return (
                    <TableRow key={usr.id}>
                      <TableCell>
                        {(page - 1) * resultsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{usr.name}</TableCell>
                      <TableCell>{usr.email}</TableCell>
                      <TableCell>{usr.role}</TableCell>
                      <TableCell>{usr.branch.branch_name}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="small"
                            className="bg-blue-700 text-white"
                            onClick={() => openUserDetails(usr.id)}
                          >
                            <EyeIcon className="w-4 h-4 mr-1" /> Lihat
                          </Button>
                          <Button
                            size="small"
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                            onClick={() => handleEdit(usr)}
                          >
                            <EditIcon className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="small"
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => setDeletingUser(usr)}
                          >
                            <TrashIcon className="w-4 h-4 mr-1" /> Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TableFooter>
            <div className="flex flex-col md:flex-row items-center justify-between p-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Show</span>
                <select
                  className="form-select w-20 text-sm"
                  value={resultsPerPage}
                  onChange={(e) => {
                    setResultsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-500 ml-2">entries</span>
              </div>
              <Pagination
                totalResults={totalUsers}
                resultsPerPage={resultsPerPage}
                onChange={setPage}
                label="Table navigation"
              />
            </div>
          </TableFooter>
        </TableContainer>
      </div>

      {/* Pop-up Tambah User */}
      {addingUser && (
        <AddUserModal
          user={initialUser}
          onClose={closeAddModal}
          onSuccess={() => {
            getUsers().then((res) => {
              setAllUsers(res.data);
              setTotalUsers(res.meta.total);
            });
          }}
        />
      )}

      {/* Pop-up Edit User */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={closeEditModel}
          onSuccess={() => {
            getUsers().then((res) => {
              setAllUsers(res.data);
              setTotalUsers(res.meta.total);
            });
          }}
        />
      )}

      {/* Pop-up Detail User */}
      {isModalOpen && selectedUser && (
        <DetailUserModal user={selectedUser} onClose={closeUserDetails} />
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
