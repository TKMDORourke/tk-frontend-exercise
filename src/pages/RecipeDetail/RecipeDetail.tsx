import { useParams } from "react-router-dom";
import { useRecipeQuery } from "./hooks";
import { InvalidRequestError, NotFoundError } from "./exceptions";

type RecipeParams = {
  recipeId: string;
};

const RecipeDetail = () => {
  const { recipeId } = useParams<RecipeParams>();

  const { recipe, isLoading, isError, error } = useRecipeQuery(recipeId);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  const getErrorMessage = (error: unknown) => {
    if (error instanceof NotFoundError) {
      return "No recipe exists for this ID";
    }
    if (error instanceof InvalidRequestError) {
      return "This ID is in the wrong format";
    }
    return "Could not load recipe, please try again later";
  };

  if (isError) {
    const errorMessage = getErrorMessage(error);
    return <span role="alert">{errorMessage}</span>;
  }

  return (
    <>
      {recipe && <h1>{recipe.name}</h1>}
      {recipe?.authorName && <h2>By {recipe.authorName}</h2>}
    </>
  );
};

export default RecipeDetail;
