// File: pages/superadmin/kategori/page.tsx
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
import PageTitle from "example/components/Typography/PageTitle";
import AddCategoryModal from "./tambah";
import EditCategoryModal from "./edit";
import DetailCategoryModal from "./detail";
import DeleteCategoryModal from "./delete";
import Loader from "example/components/Loader/Loader";
import {
  getCategories,
  getCategoryById,
  deletecategory,
} from "service/categoryService";
import { BaseCategory, Category } from "types/category";

function ManajemenKategori() {
  //detail
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openCategoryDetails = async (id: number) => {
    try {
      const user = await getCategoryById(id);
      setSelectedCategory(user);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Gagal mengambil detail pengguna: ", error);
    }
  };
  const closeCategoryDetails = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  // add
  const [addingCategory, setAddingCategory] = useState(false);
  const handleAdd = () => {
    setAddingCategory(true);
  };
  const closeAddModal = () => {
    setAddingCategory(false);
  };
  const initialCategory: BaseCategory = {
    category_name: "",
    category_type: "pemasukan",
  };

  // edit
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const handleEdit = (user: Category) => {
    setEditingCategory(user);
  };
  const closeEditModel = () => {
    setEditingCategory(null);
  };

  // delete
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      await deletecategory(deletingCategory.id);
      getCategories().then((res) => {
        setAllCategories(res.data);
      });
      setDeletingCategory(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // index
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [totalCategory, setTotalCategory] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [page, setPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const categoryResponse = await getCategories();
      setAllCategories(categoryResponse.data);
    } catch (error) {
      console.error("Error fetching Users: ", error);
      setError("Gagal mengambil data pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = allCategories.filter((cat) =>
        cat.category_name.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      const startIndex = (page - 1) * resultsPerPage;
      const Pagination = filtered.slice(
        startIndex,
        startIndex + resultsPerPage
      );

      setCategories(Pagination);
      setTotalCategory(filtered.length);
    }, 300);
    return () => clearTimeout(timeout);
  }, [allCategories, searchKeyword, page, resultsPerPage]);

  if (error) return <p className="tex;t-red-500">{error}</p>;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Layout>
      <PageTitle>Manajemen Kategori</PageTitle>

      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">List Kategori</h3>
        <Button
          size="small"
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
          onClick={() => handleAdd()}
        >
          <PlusIcon className="w-4 h-4" /> <span>Tambah Kategori</span>
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-b-lg overflow-x-auto">
        <div className="p-4">
          <Input
            placeholder="🔍 Cari Kategori"
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
                <TableCell>Nama Kategori</TableCell>
                <TableCell>Tipe</TableCell>
                <TableCell>Aksi</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Tidak ada data pengguna.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat, index) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      {(page - 1) * resultsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{cat.category_name}</TableCell>
                    <TableCell>{cat.category_type}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="small"
                          className="bg-blue-700 text-white"
                          onClick={() => openCategoryDetails(cat.id)}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" /> Lihat
                        </Button>
                        <Button
                          size="small"
                          className="bg-yellow-400 text-black hover:bg-yellow-500"
                          onClick={() => handleEdit(cat)}
                        >
                          <EditIcon className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="small"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => setDeletingCategory(cat)}
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
                totalResults={totalCategory}
                resultsPerPage={resultsPerPage}
                onChange={setPage}
                label="Table navigation"
              />
            </div>
          </TableFooter>
        </TableContainer>
      </div>
      {/* Pop-up tambah kategori */}
      {addingCategory && (
        <AddCategoryModal
          category={initialCategory}
          onClose={closeAddModal}
          onSuccess={() => {
            getCategories().then((res) => {
              setAllCategories(res.data);
            });
          }}
        />
      )}
      {/* Pop-up edit kategori */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={closeEditModel}
          onSuccess={() => {
            getCategories().then((res) => {
              setAllCategories(res.data);
            });
          }}
        />
      )}
      {/* Pop-up detail kategori */}
      {isModalOpen && selectedCategory && (
        <DetailCategoryModal
          category={selectedCategory}
          onClose={closeCategoryDetails}
        />
      )}
      {/* Pop-up hapus kategori */}
      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onDelete={handleDeleteCategory}
        />
      )}
    </Layout>
  );
}

export default ManajemenKategori;
