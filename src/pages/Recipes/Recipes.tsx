import { Link } from "react-router-dom";
import { useRecipesQuery } from "./hooks";
import { Header, StyledLink } from "../../shared/components/Header";
import styled from "styled-components";

const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecipeLink = styled(Link)`
  padding: 0.5em;
  margin-bottom: 1em;
  border: 1px solid #fff;
  border-radius: 24px;
  background: #fff;
  font-size: 2em;
  text-align: center;
  color: #144fcc;
`;

const Recipes = () => {
  const { recipes, isLoading } = useRecipesQuery();

  return (
    <>
      <Header>
        <StyledLink to="/recipes/create">Create a new recipe</StyledLink>
      </Header>
      <RecipeContainer>
        {!isLoading &&
          recipes &&
          recipes.map((recipe) => (
            <RecipeLink
              role="listitem"
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
            >
              {recipe.name}
            </RecipeLink>
          ))}
      </RecipeContainer>
    </>
  );
};

export default Recipes;
