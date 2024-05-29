import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import RecipeDetail from "./RecipeDetail";
import { InvalidRequestError, NotFoundError } from "./exceptions";

const mockUseRecipeQuery = jest.fn();

jest.mock("./hooks", () => {
  const originalModule = jest.requireActual("./hooks");
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
        authorName: "Test User",
      },
    });

    renderComponent();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Recipe 1"
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "By Test User"
    );
  });

  it("renders a loading message while loading", () => {
    mockUseRecipeQuery.mockReturnValue({
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the correct error message when the recipe does not exist", () => {
    mockUseRecipeQuery.mockReturnValue({
      isError: true,
      error: new NotFoundError(),
    });

    renderComponent();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No recipe exists for this ID"
    );
  });

  it("renders the correct error message when the recipe ID is invalid", () => {
    mockUseRecipeQuery.mockReturnValue({
      isError: true,
      error: new InvalidRequestError(),
    });

    renderComponent();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This ID is in the wrong format"
    );
  });

  it("renders a generic error message when there is an unknown error", () => {
    mockUseRecipeQuery.mockReturnValue({
      isError: true,
    });

    renderComponent();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load recipe, please try again later"
    );
  });
});
