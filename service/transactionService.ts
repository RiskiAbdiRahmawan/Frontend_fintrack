import axiosInstance from "../lib/axios";
import {
  Transaction,
  UpdateTransaction,
  CreateTransaction,
  LockTransaction,
  TransactionResponse,
  PosResPonse,
} from "types/transaction";

export const getTransactions = async (): Promise<TransactionResponse> => {
  const response = await axiosInstance.get("/transaction-detail");
  return response.data;
};

export const getTransactionsByBranch = async (
  branchId: number
): Promise<TransactionResponse> => {
  const response = await axiosInstance.get("/transaction-branch/" + branchId);
  return response.data;
};

export const getTransactionById = async (id: number): Promise<Transaction> => {
  const response = await axiosInstance.get<{ data: Transaction }>(
    "/transaction/" + id
  );
  return response.data.data;
};

export const createTransaction = async (
  data: CreateTransaction
): Promise<Transaction> => {
  const response = await axiosInstance.post<{ data: Transaction }>(
    "/transaction",
    data
  );
  return response.data.data;
};

export const updateTransaction = async (
  id: number,
  data: UpdateTransaction
): Promise<Transaction> => {
  const response = await axiosInstance.patch<{ data: Transaction }>(
    "/transaction/" + id,
    data
  );
  return response.data.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  const response = await axiosInstance.delete("/transaction/" + id);
  return response.data;
};

export const lockTransaction = async (
  id: number,
  data: LockTransaction
): Promise<Transaction> => {
  const response = await axiosInstance.patch<{ data: Transaction }>(
    "/transaction-lock/" + id,
    data
  );
  return response.data.data;
};

export const getPos = async (): Promise<PosResPonse> => {
  const response = await axiosInstance.get("/transaction-pos");
  return response.data;
};
