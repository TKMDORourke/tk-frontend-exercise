import { useParams, Link } from "react-router-dom";
import { useRecipeQuery } from "../../shared/hooks";
import ErrorMessage from "./components/ErrorMessage";
import Recipe from "./components/Recipe";

type RecipeParams = {
  recipeId: string;
};

const RecipeDetail = () => {
  const { recipeId } = useParams<RecipeParams>();

  const { recipe, isLoading, isError, error } = useRecipeQuery(recipeId);

  const getChildComponent = () => {
    if (isError) {
      return <ErrorMessage error={error} />;
    }
    if (isLoading) {
      return <p>Loading...</p>;
    }
    if (recipe) {
      return <Recipe recipe={recipe} />;
    }
    return (
      <ErrorMessage
        error={new Error("Recipe not returned but no error raised")}
      />
    );
  };

  return (
    <>
      <Link to="/recipes">Back to all recipes</Link>
      {recipe && (
        <>
          <br />
          <Link to={`/recipes/${recipe.id}/edit`}>Edit this recipe</Link>
        </>
      )}
      {getChildComponent()}
    </>
  );
};

export default RecipeDetail;
