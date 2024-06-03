import { useParams, Link } from "react-router-dom";
import { useRecipeQuery } from "../../shared/hooks";
import ErrorMessage from "./components/ErrorMessage";
import Recipe from "./components/Recipe";
import { Header, StyledLink } from "../../shared/components/Header";

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
      <Header>
        <StyledLink to="/recipes">Back to all recipes</StyledLink>
        {recipe && (
          <StyledLink to={`/recipes/${recipe.id}/edit`}>
            Edit this recipe
          </StyledLink>
        )}
      </Header>
      {getChildComponent()}
    </>
  );
};

export default RecipeDetail;
