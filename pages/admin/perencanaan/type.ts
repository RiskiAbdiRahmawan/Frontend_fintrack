export type BudgetItem = {
  kategori: string;
  deskripsi: string;
  jumlah: number;
};

export type Budget = {
  id: number;
  amount: number;
  spent: number;
  periode: string;
  tanggalPengajuan: Date;
  status: "Diajukan" | "Disetujui" | "Ditolak" | "Revisi" | "Pending" | "Draft" | "Revisi Diminta";
  catatanAdmin?: string;
  items: BudgetItem[];
};
