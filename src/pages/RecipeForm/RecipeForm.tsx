import { Link, Redirect } from "react-router-dom";
import { useUsersQuery, useCreateRecipeMutation } from "./hooks";
import UserSelect from "./components/UserSelect";
import { useState } from "react";

type FormData = {
  name: string;
  authorId: string;
};

const RecipeForm = () => {
  const { users, isLoading } = useUsersQuery();
  const createRecipe = useCreateRecipeMutation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    authorId: "",
  });

  const [serverError, setServerError] = useState<string>();

  const [redirectUrl, setRedirectUrl] = useState<string>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

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
  };

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <>
      <Link to="/recipes">Back to all recipes</Link>
      <h1>New Recipe</h1>
      {serverError && (
        <div role="alert">
          <span>Sorry, we couldn't create this recipe!</span>
        </div>
      )}
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <label>
            <span>Name: </span>
            <input
              required
              type="text"
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
  );
};

export default RecipeForm;
