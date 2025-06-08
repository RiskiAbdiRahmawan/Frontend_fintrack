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
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

import Layout from "example/containers/Layout";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import Loader from "example/components/Loader/Loader";
import AddTransaksiModal from "./tambah";
import EditTransaksiModal from "./edit";
import DetailTransaksiModal from "./detail";
import { Transaction, CreateTransaction } from "../../../types/transaction";
import {
  getTransactionsByBranch,
  getTransactionById,
  lockTransaction,
} from "../../../service/transactionService";

function ManajemenTransaksi() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [lockedCount, setLockedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  //detail
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openTransactionDetails = async (id: number) => {
    try {
      const transaction = await getTransactionById(id);
      setSelectedTransaction(transaction);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Gagal mengambil detail transaksi", error);
    }
  };
  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  // edit
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
  };
  const closeEditModel = () => {
    setEditTransaction(null);
  };

  //add
  const [addTransaction, setAddTransaction] = useState(false);
  const handleAdd = () => {
    setAddTransaction(true);
  };
  const clodeAddModal = () => {
    setAddTransaction(false);
  };
  const initialTransaction: CreateTransaction = {
    user_id: 0,
    branch_id: 0,
    category_id: 0,
    amount: 0,
    transaction_date: "",
    description: "",
  };

  //lock
  const handleLock = async (transaction: Transaction) => {
    if (!transaction.id) return;

    try {
      const updated = await lockTransaction(transaction.id, {
        is_locked: true,
      });
      getTransactionsByBranch(Number(localStorage.getItem("branch_id"))).then(
        (res) => {
          setAllTransactions(res.data);
          setTotalResults(res.meta.total);
          setTodayCount(res.meta.today_count);
          setLockedCount(res.meta.locked_count);
        }
      );

      setAllTransactions((prev) =>
        prev.map((t) =>
          t.id === updated.id
            ? {
                ...updated,
                user: updated.user ?? t.user,
                branch: updated.branch ?? t.branch,
                category: updated.category ?? t.category,
              }
            : t
        )
      );
    } catch (error) {
      console.error("Gagal mengunci transaksi:", error);
    }
  };

  // index
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const branchId = Number(localStorage.getItem("branch_id"));
      const response = await getTransactionsByBranch(branchId);
      setAllTransactions(response.data);
      setTotalResults(response.meta.total);
      setTodayCount(response.meta.today_count);
      setLockedCount(response.meta.locked_count);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = allTransactions.filter((t) =>
        t.category.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      const start = (page - 1) * resultsPerPage;
      const pagination = filtered.slice(start, start + resultsPerPage);

      setTransactions(pagination);
      setTotalResults(filtered.length);
    }, 300);

    return () => clearTimeout(timeout);
  }, [allTransactions, searchKeyword, page, resultsPerPage]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manajemen Transaksi</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center ">
            <CalendarDaysIcon className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Transaksi Hari Ini</p>
              <p className="text-xl font-semibold text-gray-800">
                {todayCount}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <ClipboardDocumentListIcon className="w-8 h-8 text-indigo-600 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Transaksi</p>
              <p className="text-xl font-semibold text-gray-800">
                {totalResults}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <LockClosedIcon className="w-8 h-8 text-red-600 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Transaksi Terkunci</p>
              <p className="text-xl font-semibold text-gray-800">
                {lockedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Keterangan Warna */}
        <div className="flex items-center space-x-4 px-4 pt-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-gray-400" />
            <span className="text-sm text-gray-700">Pemasukan</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-gray-400" />
            <span className="text-sm text-gray-700">Pengeluaran</span>
          </div>
        </div>

        {/* Header Table */}
        <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">List Transaksi</h3>
          <Button
            size="small"
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
            onClick={() => handleAdd()}
          >
            <PlusIcon className="w-4 h-4" /> <span>Tambah Transaksi</span>
          </Button>
        </div>

        {/* Table & Search */}
        <div className="bg-white shadow-md rounded-b-lg overflow-x-auto">
          <div className="p-4">
            <Input
              placeholder="🔍 Search Kategori"
              className="w-1/3 mb-4"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <TableContainer className="max-w-[1400px] mx-auto overflow-x-auto mb-10">
            <Table className="w-full border border-gray-300">
              <TableHeader>
                <tr className="bg-indigo-100">
                  <TableCell>No</TableCell>
                  <TableCell>Kategori</TableCell>
                  <TableCell>Jumlah</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Keterangan</TableCell>
                  <TableCell>Aksi</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Loading...
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data transaksi.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t, index) => (
                    <TableRow
                      key={t.id}
                      className={
                        t.category.type.toLowerCase() === "pemasukan"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }
                    >
                      <TableCell className="border-t border-r">
                        {(page - 1) * resultsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="border-t border-r">
                        {t.category.name}
                      </TableCell>
                      <TableCell className="border-t border-r">
                        Rp{Number(t.amount).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="border-t border-r">
                        {new Date(t.transaction_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </TableCell>
                      <TableCell className="border-t border-r">
                        {t.description}
                      </TableCell>
                      <TableCell className="border-t">
                        <div className="flex space-x-2">
                          <Button
                            size="small"
                            className="bg-blue-700 text-white"
                            onClick={() => openTransactionDetails(t.id)}
                          >
                            <EyeIcon className="w-4 h-4 mr-1" /> Lihat
                          </Button>
                          <Button
                            size="small"
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                            disabled={t.is_locked}
                            onClick={() => handleEdit(t)}
                          >
                            <EditIcon className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="small"
                            className="bg-gray-700 text-white hover:bg-gray-800"
                            disabled={t.is_locked}
                            onClick={() => handleLock(t)}
                          >
                            🔒 {t.is_locked ? "Terkunci" : "Kunci"}
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
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={setPage}
                  label="Table navigation"
                />
              </div>
            </TableFooter>
          </TableContainer>
        </div>

        {/* Popup detail */}
        {isModalOpen && selectedTransaction && (
          <DetailTransaksiModal
            transaction={selectedTransaction}
            onClose={closeTransactionDetails}
          />
        )}
        {/* Popup edit */}
        {editTransaction && (
          <EditTransaksiModal
            transaction={editTransaction}
            onClose={closeEditModel}
            onSuccess={() => {
              getTransactionsByBranch(
                Number(localStorage.getItem("branch_id"))
              ).then((res) => {
                setAllTransactions(res.data);
                setTotalResults(res.meta.total);
                setTodayCount(res.meta.today_count);
                setLockedCount(res.meta.locked_count);
              });
            }}
          />
        )}
        {/* Popup tambah */}
        {addTransaction && (
          <AddTransaksiModal
            transaction={initialTransaction}
            onClose={clodeAddModal}
            onSuccess={() => {
              getTransactionsByBranch(
                Number(localStorage.getItem("branch_id"))
              ).then((res) => {
                setAllTransactions(res.data);
                setTotalResults(res.meta.total);
                setTodayCount(res.meta.today_count);
                setLockedCount(res.meta.locked_count);
              });
            }}
          />
        )}
      </div>
    </Layout>
  );
}

export default ManajemenTransaksi;
