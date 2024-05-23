import { FC } from "react";
import type { Recipe as RecipeType } from "../../../types";

type RecipeProps = {
  recipe: RecipeType;
};

const Recipe: FC<RecipeProps> = ({ recipe }) => {
  const { name, authorName, ingredients } = recipe;
  return (
    <>
      <h1>{name}</h1>
      <h2>By {authorName}</h2>
      {ingredients && (
        <>
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Recipe;
