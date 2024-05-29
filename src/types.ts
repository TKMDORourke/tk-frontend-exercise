export type Ingredient = {
  id: string;
  name: string;
};

export type Recipe = {
  id: string;
  name: string;
  authorId: string;
  authorName: string;
  ingredients?: Ingredient[];
};

export type RecipeListing = Pick<Recipe, "id" | "name" | "authorId">;

export type User = {
  id: string;
  name: string;
  email: string;
};
