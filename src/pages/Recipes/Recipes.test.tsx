import { render, screen } from "@testing-library/react";

import Recipes from "./Recipes";

const mockUseRecipesQuery = jest.fn();

jest.mock("./hooks", () => {
  const originalModule = jest.requireActual("./hooks");
  return {
    ...originalModule,
    useRecipesQuery: () => mockUseRecipesQuery(),
  };
});

describe("Recipes", () => {
  it("renders a list of all available recipes", () => {
    mockUseRecipesQuery.mockReturnValue({
      isLoading: false,
      recipes: [
        {
          id: "abc",
          name: "Recipe 1",
          authorId: "def",
        },
      ],
    });

    render(<Recipes />);

    expect(screen.getByRole("listitem")).toHaveTextContent("Recipe 1");
  });
});
