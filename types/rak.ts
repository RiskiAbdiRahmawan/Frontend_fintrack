export interface RakBase {
  id: number;
  period: string;
  submission_date: string;
  status: string;
  revision_note?: string;
  total_amount: number;
  branch: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
}

export interface RakDetail extends RakBase {
  detail: RakDetailBase[];
}

export interface RakDetailBase {
  id: number;
  description: string;
  amount: number;
  category: {
    id: number;
    name: string;
  };
}

export interface RakResponse {
  data: RakBase[];
}

export interface RakResponseSingle {
  data: RakBase;
}

export interface RakResponseDetail {
  data: RakDetail;
}

export interface CreateBudget {
  branch_id: number;
  user_id: number;
  period: string;
  submission_date: string;
  status: string;
}

export interface CreateBudgetDetail {
  budget_id: number;
  category_id: number;
  description: string;
  amount: number;
}

export interface UpdateRak {
  period: string;
  category_id: number;
  description: string;
  amount: number;
  status: string;
}
