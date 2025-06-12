export interface BaseTransaction {
  amount: number;
  transaction_date: string;
  description?: string;
}

export interface CreateTransaction extends BaseTransaction {
  user_id: number;
  branch_id: number;
  category_id: number;
}

export interface UpdateTransaction extends BaseTransaction {
  category_id: number;
}

export interface LockTransaction {
  is_locked: boolean;
}

export interface Transaction extends BaseTransaction {
  id: number;
  is_locked: boolean;
  user: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
    type: string;
  };
}

export interface TransactionResponse {
  data: Transaction[];
  meta: {
    status: string;
    total: number;
    today_count: number;
    locked_count: number;
  };
}

export interface PosResPonse {
  data: Transaction[];
  meta: {
    status: string;
    total: number;
    total_amount: number;
  };
}
