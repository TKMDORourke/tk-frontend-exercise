import { FC } from "react";
import { type Recipe as RecipeType } from "../../../types";
import styled from "styled-components";

const RecipeCard = styled.div`
  padding: 0.5em;
  border: 1px solid #fff;
  border-radius: 24px;
  background: #fff;
  text-align: center;
  color: #144fcc;
`;

const RecipeName = styled.h1`
  font-size: 3em;
  font-style: italic;
  text-transform: uppercase;
  margin: 0.5em 0 0 0;
`;

const AuthorName = styled.h2`
  font-size: 2em;
  font-variant: all-small-caps;
  margin: 0.5em 0 0.5em 0;
`;

const IngredientsContainer = styled.div`
  padding-left: 1em;
  text-align: left;

  h3 {
    margin: 0.5em 0;
  }

  ul {
    margin: 0.5em 0;
  }

  li {
    margin: 0.25em 0;
  }
`;

type RecipeProps = {
  recipe: RecipeType;
};

const Recipe: FC<RecipeProps> = ({ recipe }) => (
  <RecipeCard>
    <RecipeName>{recipe.name}</RecipeName>
    {recipe.authorName && <AuthorName>By {recipe.authorName}</AuthorName>}
    {recipe.ingredients.length > 0 && (
      <IngredientsContainer>
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))}
        </ul>
      </IngredientsContainer>
    )}
  </RecipeCard>
);

export default Recipe;
