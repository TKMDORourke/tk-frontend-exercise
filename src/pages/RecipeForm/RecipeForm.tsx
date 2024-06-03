import { Redirect, useParams } from "react-router-dom";
import {
  useUsersQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
} from "./hooks";
import UserSelect from "./components/UserSelect";
import { useState, FC, useEffect } from "react";
import { useRecipeQuery } from "../../shared/hooks";
import { Header, StyledLink } from "../../shared/components/Header";
import { ErrorPanel } from "../../shared/components/ErrorPanel";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 2em;
  margin: 0.5em 0 0.5em 0;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 2em;
  }
`;

export const StyledInputContainer = styled.div`
  input,
  select {
    padding: 0.5em;
    border: none;
    border-bottom: 1px solid;
    background: transparent;
    color: inherit;
    margin: 0.5em;
  }
`;

const StyledButton = styled.button`
  font-size: 1em;
  text-align: left;
  width: fit-content;
  border: 1px solid #fff;
  background: #fff;
  color: #144fcc;
  padding: 1em;
  border-radius: 24px;
  cursor: pointer;
`;

type FormData = {
  name: string;
  authorId: string;
};

type FormMode = "CREATE" | "UPDATE";

const RecipeForm: FC<{ mode: FormMode }> = ({ mode }) => {
  const getRecipeId = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    return recipeId;
  };
  const { recipe, isLoading: isRecipeLoading } =
    mode === "UPDATE"
      ? useRecipeQuery(getRecipeId())
      : { recipe: undefined, isLoading: false };

  const { users, isLoading: areUsersLoading } = useUsersQuery();
  const createRecipe = useCreateRecipeMutation();
  const updateRecipe = useUpdateRecipeMutation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    authorId: "",
  });

  useEffect(() => {
    if (mode === "UPDATE" && recipe && !isRecipeLoading) {
      const { name, authorId } = recipe;
      setFormData({
        name,
        authorId,
      });
    }
  }, [isRecipeLoading]);

  const [serverError, setServerError] = useState<boolean>(false);
  const serverErrorMessage = `Sorry, we couldn't ${
    mode === "UPDATE" ? "update" : "create"
  } this recipe!`;

  const [redirectUrl, setRedirectUrl] = useState<string>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === "UPDATE" && recipe) {
      updateRecipe.mutate(
        {
          id: recipe.id,
          name: formData.name,
          authorId: formData.authorId,
          ingredients: [],
        },
        {
          onSuccess: () => setRedirectUrl(`/recipes/${recipe.id}`),
          onError: () => setServerError(true),
        }
      );
    } else {
      createRecipe.mutate(
        {
          name: formData.name,
          authorId: formData.authorId,
        },
        {
          onSuccess: ({ id }) => setRedirectUrl(`/recipes/${id}`),
          onError: () => {
            setServerError(true);
          },
        }
      );
    }
  };

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <>
      <Header>
        <StyledLink to="/recipes">Back to all recipes</StyledLink>
      </Header>
      {(isRecipeLoading && <p>Loading...</p>) || (
        <>
          <Title>{mode === "UPDATE" ? "Edit" : "New"} Recipe</Title>
          {serverError && (
            <ErrorPanel role="alert">
              <span>{serverErrorMessage}</span>
            </ErrorPanel>
          )}
          {!areUsersLoading && (
            <StyledForm onSubmit={handleSubmit}>
              <label>
                <span>Name</span>
                <StyledInputContainer>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        name: event.target.value,
                      })
                    }
                  />
                </StyledInputContainer>
              </label>
              <UserSelect
                users={users}
                selectedUser={formData?.authorId}
                onUserChange={(userId) =>
                  setFormData({ ...formData, authorId: userId })
                }
              />
              <StyledButton type="submit">Save Recipe</StyledButton>
            </StyledForm>
          )}
        </>
      )}
    </>
  );
};

export default RecipeForm;
