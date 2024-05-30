import { render, screen } from "@testing-library/react";
import { Recipe as RecipeType } from "../../../types";
import Recipe from "./Recipe";

describe("Recipe", () => {
  it("renders the details of a recipe", () => {
    const recipe: RecipeType = {
      id: "abc",
      name: "Recipe 1",
      authorId: "def",
      ingredients: [],
    };

    render(<Recipe recipe={recipe} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Recipe 1"
    );
  });

  it("renders the author line if an author is provided", () => {
    const recipe: RecipeType = {
      id: "abc",
      name: "Recipe 1",
      authorId: "def",
      authorName: "Test User",
      ingredients: [],
    };

    render(<Recipe recipe={recipe} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "By Test User"
    );
  });

  it("does not render the author line if an author is not provided", () => {
    const recipe: RecipeType = {
      id: "abc",
      name: "Recipe 1",
      authorId: "def",
      ingredients: [],
    };

    render(<Recipe recipe={recipe} />);

    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("renders ingredients if they are provided", () => {
    const recipe: RecipeType = {
      id: "abc",
      name: "Recipe 1",
      authorId: "def",
      ingredients: [
        {
          id: "ghi",
          name: "Onion",
        },
      ],
    };

    render(<Recipe recipe={recipe} />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Ingredients:"
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Onion");
  });

  it("does not render ingredient list if none are provided", () => {
    const recipe: RecipeType = {
      id: "abc",
      name: "Recipe 1",
      authorId: "def",
      ingredients: [],
    };

    render(<Recipe recipe={recipe} />);

    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });
});
