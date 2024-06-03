export type Ingredient = {
  id: string;
  name: string;
};

export type Recipe = {
  id: string;
  name: string;
  authorId: string;
  authorName?: string;
  ingredients: Ingredient[];
};

export type RecipeListing = Pick<Recipe, "id" | "name" | "authorId">;

export type RecipeCreation = Pick<Recipe, "name" | "authorId">;

export type RecipeUpdate = Pick<Recipe, "id" | "name" | "authorId"> & {
  ingredients: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};
