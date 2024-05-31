import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchAllUsers, type FetchAllUsersResponse } from "../api";
import type { User } from "../../../types";
import camelize from "camelize-ts";

type UsersQueryResult = UseQueryResult<FetchAllUsersResponse> & {
  users: User[];
};

const useUsersQuery = (): UsersQueryResult => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  return {
    ...query,
    users: camelize(query.data?.users) || [],
  };
};

export default useUsersQuery;
