import { BASE_URL } from "../../config";

export type FetchAllRecipesResponse = {
  recipes: {
    id: string;
    name: string;
    author_id: string;
  }[];
};

export const fetchAllRecipes = async (): Promise<FetchAllRecipesResponse> => {
  const response = await fetch(`${BASE_URL}/recipes`);
  return response.json() as Promise<FetchAllRecipesResponse>;
};
