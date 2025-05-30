import axios from "../lib/axios";
// import { Branch } from "types/branch";

export const getbranches = async () => {
  const response = await axios.get("/branch");
  return response.data;
};
