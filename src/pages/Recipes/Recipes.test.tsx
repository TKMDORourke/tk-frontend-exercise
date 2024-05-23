import { render, screen } from "@testing-library/react";

import Recipes from "./Recipes";

describe("Recipes", () => {
  it("renders a list of all available recipes", () => {
    render(<Recipes />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(2);
  });
});
