import { FC } from "react";
import { type Recipe as RecipeType } from "../../../types";

type RecipeProps = {
  recipe: RecipeType;
};

const Recipe: FC<RecipeProps> = ({ recipe }) => (
  <>
    <h1>{recipe.name}</h1>
    {recipe.authorName && <h2>By {recipe.authorName}</h2>}
    {recipe.ingredients.length > 0 && (
      <>
        <h3>Ingredients:</h3>
        <li>
          {recipe.ingredients.map(({ id, name }) => (
            <ul key={id}>{name}</ul>
          ))}
        </li>
      </>
    )}
  </>
);

export default Recipe;
