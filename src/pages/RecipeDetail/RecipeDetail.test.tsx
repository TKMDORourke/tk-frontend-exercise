import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import RecipeDetail from "./RecipeDetail";

const mockUseRecipeQuery = jest.fn();

jest.mock("../../shared/hooks", () => {
  const originalModule = jest.requireActual("../../shared/hooks");
  return {
    ...originalModule,
    useRecipeQuery: (recipeId: string) => mockUseRecipeQuery(recipeId),
  };
});

describe("RecipeDetail", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/recipes/abc"]}>
        <RecipeDetail />
      </MemoryRouter>
    );

  it("renders the details of a recipe", () => {
    mockUseRecipeQuery.mockReturnValue({
      isLoading: false,
      recipe: {
        id: "abc",
        name: "Recipe 1",
        authorId: "def",
        ingredients: [],
      },
    });

    renderComponent();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Recipe 1"
    );
  });

  it("renders a link to the edit page if a recipe is provided", () => {
    mockUseRecipeQuery.mockReturnValue({
      isLoading: false,
      recipe: {
        id: "abc",
        name: "",
        authorId: "",
        ingredients: [],
      },
    });

    renderComponent();

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("does not render a link to the edit page if a recipe is not provided", () => {
    mockUseRecipeQuery.mockReturnValue({
      isLoading: false,
    });

    renderComponent();

    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders a loading message while loading", () => {
    mockUseRecipeQuery.mockReturnValue({
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the error message component if there is an error", () => {
    mockUseRecipeQuery.mockReturnValue({
      isError: true,
      error: new Error(),
    });

    renderComponent();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load recipe, please try again later"
    );
  });

  it("renders the error message component if there is no error but the recipe is not loaded", () => {
    mockUseRecipeQuery.mockReturnValue({
      isError: false,
      recipe: undefined,
    });

    renderComponent();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load recipe, please try again later"
    );
  });
});
