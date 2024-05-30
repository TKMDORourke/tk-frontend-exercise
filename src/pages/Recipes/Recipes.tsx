import { Link } from "react-router-dom";
import { useRecipesQuery } from "./hooks";

const Recipes = () => {
  const { recipes, isLoading } = useRecipesQuery();

  return (
    <>
      <ul>
        {!isLoading &&
          recipes &&
          recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Recipes;
