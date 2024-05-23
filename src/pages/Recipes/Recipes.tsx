import type { Recipe as RecipeType } from "../../types";

import Recipe from "./Recipe/Recipe";

const getRecipes = (): RecipeType[] => {
  return [
    {
      id: "abc",
      name: "Recipe 1",
      authorId: "abc",
      authorName: "Test User",
      ingredients: [
        {
          id: "abc",
          name: "Onion",
        },
        {
          id: "def",
          name: "Carrot",
        },
      ],
    },
    {
      id: "abc",
      name: "Recipe 2",
      authorId: "abc",
      authorName: "Test User",
    },
  ];
};

const Recipes = () => {
  const recipes = getRecipes();
  return (
    <>
      {recipes.map((recipe) => (
        <Recipe recipe={recipe} />
      ))}
    </>
  );
};

export default Recipes;
