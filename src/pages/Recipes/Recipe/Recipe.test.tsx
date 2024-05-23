import { render, screen } from "@testing-library/react";

import { Recipe as RecipeType } from "../../../types";
import Recipe from "./Recipe";

describe("Recipe", () => {
  it("renders a recipe with the given details", () => {
    const recipe: RecipeType = {
      id: "abc",
      name: "Recipe 1",
      authorId: "abc",
      authorName: "Test User",
      ingredients: [
        {
          id: "abc",
          name: "Onion",
        },
        {
          id: "def",
          name: "Carrot",
        },
      ],
    };
    render(<Recipe recipe={recipe} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Recipe 1"
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "By Test User"
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("does not render ingredients when they are not available", () => {
    const recipe: RecipeType = {
      id: "abc",
      name: "Recipe 1",
      authorId: "abc",
      authorName: "Test User",
    };

    render(<Recipe recipe={recipe} />);

    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });
});
