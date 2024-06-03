import { BASE_URL } from "../../config";
import { NotFoundError } from "../../shared/exceptions";

export type FetchAllUsersResponse = {
  users: {
    id: string;
    name: string;
    email: string;
  }[];
};

export type CreateRecipeRequest = {
  name: string;
  author_id: string;
};

export type CreateRecipeResponse = {
  id: string;
  name: string;
  author_id: string;
};

export type UpdateRecipeRequest = {
  name: string;
  author_id: string;
  ingredients: string[];
};

export const fetchAllUsers = async (): Promise<FetchAllUsersResponse> => {
  const response = await fetch(`${BASE_URL}/users`);
  return response.json() as Promise<FetchAllUsersResponse>;
};

export const createRecipe = async (
  recipe: CreateRecipeRequest
): Promise<CreateRecipeResponse> => {
  const response = await fetch(`${BASE_URL}/recipes`, {
    method: "POST",
    body: JSON.stringify(recipe),
    headers: {
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json() as Promise<CreateRecipeResponse>;
};

export const updateRecipe = async (
  recipeId: string,
  recipe: UpdateRecipeRequest
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
    method: "PUT",
    body: JSON.stringify(recipe),
    headers: {
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError();
    }
    throw new Error();
  }
};
