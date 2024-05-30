import { render, screen } from "@testing-library/react";

import Recipes from "./Recipes";
import { MemoryRouter } from "react-router-dom";

const mockUseRecipesQuery = jest.fn();

jest.mock("./hooks", () => {
  const originalModule = jest.requireActual("./hooks");
  return {
    ...originalModule,
    useRecipesQuery: () => mockUseRecipesQuery(),
  };
});

describe("Recipes", () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <Recipes />
      </MemoryRouter>
    );
  };

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

    renderComponent();

    expect(screen.getByRole("listitem")).toHaveTextContent("Recipe 1");
  });
});
