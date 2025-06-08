export interface Category extends BaseCategory {
  id: number;
}

export interface BaseCategory {
  category_name: string;
  category_type: "pemasukan" | "pengeluaran";
}
