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
import { EyeIcon, PencilIcon as EditIcon } from "@heroicons/react/24/solid";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import { MoneyIcon } from "icons";
import { getPos } from "service/transactionService";
import { Transaction } from "types/transaction";

function POS() {
  const [pos, setPos] = useState<Transaction[]>([]);
  const [allPos, setAllPos] = useState<Transaction[]>([]);
  const [amountCount, setAmountCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const fetchPos = async () => {
    try {
      setLoading(true);
      const response = await getPos();
      setAllPos(response.data);
      setTotalResults(response.meta.total);
      setAmountCount(response.meta.total_amount);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      setError("Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPos();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = allPos.filter((t) =>
        t.category.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      const start = (page - 1) * resultsPerPage;
      const pagination = filtered.slice(start, start + resultsPerPage);

      setPos(pagination);
      setTotalResults(filtered.length);
    }, 300);

    return () => clearTimeout(timeout);
  }, [allPos, searchKeyword, page, resultsPerPage]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <PageTitle>Point Of Sales</PageTitle>

      <div className="flex flex-row gap-4 mb-4">
        <div className="bg-white px-6 py-4 rounded-lg shadow-md inline-flex min-w-[300px] max-w-fit h-[80px] items-center">
          <MoneyIcon className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold">
            Total Pemasukan dari POS: Rp{" "}
            {amountCount > 0 ? amountCount.toLocaleString("id-ID") : "-"}
          </h3>
        </div>
      </div>

      <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Tabel Pemasukan Dari POS</h3>
      </div>

      <div className="bg-white shadow-md rounded-b-lg overflow-x-auto">
        {/* <div className="p-4">
          <Input
            placeholder="🔍 Cari reservasi..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-1/3 mb-4"
          />
        </div> */}

        <TableContainer className="max-w-[1400px] mx-auto overflow-x-auto mb-10">
          <Table>
            <TableHeader>
              <tr className="bg-indigo-100">
                <TableCell>No</TableCell>
                <TableCell>Reservasi ID</TableCell>
                <TableCell>Total Pembayaran</TableCell>
                <TableCell>Tanggal</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {pos.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {(page - 1) * resultsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    {"RES-" + item.id.toString().padStart(4, "0")}
                  </TableCell>
                  <TableCell>
                    Rp {item.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="border-t border-r ">
                    {new Date(item.transaction_date).toLocaleDateString(
                      "id-ID"
                    )}
                  </TableCell>
                </TableRow>
              ))}
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
    </Layout>
  );
}

export default POS;
