import { BASE_URL } from "../config";
import { InvalidRequestError, NotFoundError } from "./exceptions";

export type FetchRecipeResponse = {
  id: string;
  name: string;
  author_id: string;
  author_name?: string;
  ingredients: {
    id: string;
    name: string;
  }[];
};

export const fetchRecipe = async (
  recipeId: string
): Promise<FetchRecipeResponse> => {
  const response = await fetch(`${BASE_URL}/recipes/${recipeId}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.error.type === "not_found") {
      throw new NotFoundError();
    } else if (error.error.type === "validation_error") {
      throw new InvalidRequestError();
    } else {
      throw new Error();
    }
  }
  return response.json() as Promise<FetchRecipeResponse>;
};
