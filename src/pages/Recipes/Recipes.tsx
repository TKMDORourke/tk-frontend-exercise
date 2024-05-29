import { useRecipesQuery } from "./hooks";

const Recipes = () => {
  const { recipes, isLoading } = useRecipesQuery();

  return (
    <>
      <ul>
        {!isLoading &&
          recipes &&
          recipes.map((recipe) => <li key={recipe.id}>{recipe.name}</li>)}
      </ul>
    </>
  );
};

export default Recipes;
