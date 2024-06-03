import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RecipeForm from "./RecipeForm";
import { MemoryRouter, Route } from "react-router-dom";

const mockUseUsersQuery = jest.fn();
const mockUseCreateRecipeMutation = jest.fn();
const mockUseUpdateRecipeMutation = jest.fn();
const mockUseRecipeQuery = jest.fn();

jest.mock("./hooks", () => {
  const originalModule = jest.requireActual("./hooks");
  return {
    ...originalModule,
    useUsersQuery: () => mockUseUsersQuery(),
    useCreateRecipeMutation: () => mockUseCreateRecipeMutation(),
    useUpdateRecipeMutation: () => mockUseUpdateRecipeMutation(),
  };
});

jest.mock("../../shared/hooks", () => {
  const originalModule = jest.requireActual("../../shared/hooks");
  return {
    ...originalModule,
    useRecipeQuery: (recipeId: string) => mockUseRecipeQuery(recipeId),
  };
});

describe("RecipeForm", () => {
  const renderComponent = (mode: "CREATE" | "UPDATE", route?: string) => {
    render(
      <MemoryRouter initialEntries={route ? [route] : undefined}>
        <RecipeForm mode={mode} />
        <Route path="/recipes/abc">
          Recipe {mode === "CREATE" ? "created" : "updated"}
        </Route>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("in create mode", () => {
    it("renders a form to create a new recipe", () => {
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [],
      });

      renderComponent("CREATE");

      expect(
        screen.getByRole("textbox", { name: "Name:" })
      ).toBeInTheDocument();
    });

    it("renders the user selection component with the given users", () => {
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [
          {
            id: "abc",
            name: "User 1",
            email: "",
          },
        ],
      });

      renderComponent("CREATE");

      expect(screen.getByRole("option", { name: "User 1" }));
    });

    it("redirects to the recipe detail page when a recipe is successfully saved", async () => {
      const user = userEvent.setup();
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [
          {
            id: "def",
            name: "Test User",
            email: "",
          },
        ],
      });
      mockUseCreateRecipeMutation.mockReturnValue({
        mutate: jest.fn((_, { onSuccess }) =>
          onSuccess({
            id: "abc",
          })
        ),
      });

      renderComponent("CREATE");

      await user.type(
        screen.getByRole("textbox", { name: "Name:" }),
        "Test Recipe"
      );
      await user.selectOptions(
        screen.getByRole("combobox", { name: "Author:" }),
        screen.getByRole("option", { name: "Test User" })
      );
      await user.click(screen.getByRole("button"));

      expect(await screen.findByText("Recipe created"));
    });

    it("renders an error message if a recipe cannot be created", async () => {
      const user = userEvent.setup();
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [
          {
            id: "def",
            name: "Test User",
            email: "",
          },
        ],
      });
      mockUseCreateRecipeMutation.mockReturnValue({
        mutate: jest.fn((_, { onError }) => onError(new Error("Failed"))),
      });

      renderComponent("CREATE");

      await user.type(
        screen.getByRole("textbox", { name: "Name:" }),
        "Test Recipe"
      );
      await user.selectOptions(
        screen.getByRole("combobox", { name: "Author:" }),
        screen.getByRole("option", { name: "Test User" })
      );
      await user.click(screen.getByRole("button"));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Sorry, we couldn't create this recipe!"
      );
    });
  });

  describe("in update mode", () => {
    it("renders a pre-populated form to update an existing recipe", () => {
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [{ id: "def", name: "Test User", email: "testuser@test.com" }],
      });
      mockUseRecipeQuery.mockReturnValue({
        isLoading: false,
        recipe: {
          id: "abc",
          name: "Recipe 1",
          authorId: "def",
          ingredients: [],
        },
      });

      renderComponent("UPDATE", "/recipes/abc/edit");

      expect(screen.getByRole("textbox")).toHaveValue("Recipe 1");
      expect(screen.getByRole("combobox")).toHaveValue("def");
    });

    it("redirects to the recipe detail page when a recipe is successfully updated", async () => {
      const user = userEvent.setup();
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [
          {
            id: "def",
            name: "Test User",
            emal: "",
          },
        ],
      });
      mockUseRecipeQuery.mockReturnValue({
        isLoading: false,
        recipe: {
          id: "abc",
          name: "Recipe 1",
          authorId: "def",
          ingredients: [],
        },
      });
      mockUseUpdateRecipeMutation.mockReturnValue({
        mutate: jest.fn((_, { onSuccess }) => onSuccess()),
      });

      renderComponent("UPDATE", "/recipes/abc/edit");

      await user.click(screen.getByRole("button"));

      expect(await screen.findByText("Recipe updated"));
    });

    it("renders an error message if a recipe cannot be updated", async () => {
      const user = userEvent.setup();
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [
          {
            id: "def",
            name: "Test User",
            email: "",
          },
        ],
      });
      mockUseRecipeQuery.mockReturnValue({
        isLoading: false,
        recipe: {
          id: "abc",
          name: "Recipe 1",
          authorId: "def",
          ingredients: [],
        },
      });
      mockUseUpdateRecipeMutation.mockReturnValue({
        mutate: jest.fn((_, { onError }) => onError(new Error("Failed"))),
      });

      renderComponent("UPDATE", "/recipes/abc/edit");

      await user.click(screen.getByRole("button"));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Sorry, we couldn't update this recipe!"
      );
    });

    it("renders a loading message if the recipe is loading", () => {
      mockUseUsersQuery.mockReturnValue({
        isLoading: false,
        users: [
          {
            id: "def",
            name: "Test User",
            email: "",
          },
        ],
      });
      mockUseRecipeQuery.mockReturnValue({
        isLoading: true,
      });

      renderComponent("UPDATE", "/recipes/abc/edit");

      expect(screen.getByText("Loading..."));
    });
  });
});
