export interface BaseUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface User extends BaseUser {
  id: number;
  branch: {
    id: number;
    branch_name: string;
  };
}

export interface UserResponse {
  data: User[];
  meta: {
    total: number;
  };
}

export interface UpdateUser extends Omit<BaseUser, "password"> {
  password?: string;
  branch_id: number;
}

export interface CreateUser extends BaseUser {
  branch_id: number;
}
