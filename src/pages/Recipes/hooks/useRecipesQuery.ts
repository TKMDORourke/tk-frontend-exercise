import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchAllRecipes, type FetchAllRecipesResponse } from "../api";
import type { RecipeListing } from "../../../types";
import camelize from "camelize-ts";

type RecipesQueryResult = UseQueryResult<FetchAllRecipesResponse> & {
  recipes?: RecipeListing[];
};

const useRecipesQuery = (): RecipesQueryResult => {
  const query = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchAllRecipes,
  });

  return {
    ...query,
    recipes: camelize(query.data?.recipes),
  };
};

export default useRecipesQuery;
