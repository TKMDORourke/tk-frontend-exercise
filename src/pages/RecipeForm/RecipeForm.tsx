import { Link, Redirect, useParams } from "react-router-dom";
import {
  useUsersQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
} from "./hooks";
import UserSelect from "./components/UserSelect";
import { useState, FC, useEffect } from "react";
import { useRecipeQuery } from "../../shared/hooks";

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

  const [serverError, setServerError] = useState<string>();
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
          onError: (error) => setServerError(error.message),
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
          onError: (error) => setServerError(error.message),
        }
      );
    }
  };

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <>
      <Link to="/recipes">Back to all recipes</Link>
      {(isRecipeLoading && <p>Loading...</p>) || (
        <>
          <h1>{mode === "UPDATE" ? "New" : "Edit"} Recipe</h1>
          {serverError && (
            <div role="alert">
              <span>{serverErrorMessage}</span>
            </div>
          )}
          {!areUsersLoading && (
            <form onSubmit={handleSubmit}>
              <label>
                <span>Name: </span>
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
              </label>
              <br />
              <UserSelect
                users={users}
                selectedUser={formData?.authorId}
                onUserChange={(userId) =>
                  setFormData({ ...formData, authorId: userId })
                }
              />
              <br />
              <button type="submit">Save Recipe</button>
            </form>
          )}
        </>
      )}
    </>
  );
};

export default RecipeForm;
