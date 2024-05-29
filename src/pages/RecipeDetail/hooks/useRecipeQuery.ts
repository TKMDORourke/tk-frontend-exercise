import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchRecipe, type FetchRecipeResponse } from "../api";
import type { Recipe } from "../../../types";
import camelize from "camelize-ts";

type RecipeQueryResult = UseQueryResult<FetchRecipeResponse> & {
  recipe?: Recipe;
};

const useRecipeQuery = (recipeId: string): RecipeQueryResult => {
  const query = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: ({ queryKey }) => fetchRecipe(queryKey[1]),
  });

  return {
    ...query,
    recipe: camelize(query.data),
  };
};

export default useRecipeQuery;
