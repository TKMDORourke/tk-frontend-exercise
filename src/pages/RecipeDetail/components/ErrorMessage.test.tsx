import { render, screen } from "@testing-library/react";
import { InvalidRequestError, NotFoundError } from "../exceptions";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders the correct error message when the recipe does not exists", () => {
    render(<ErrorMessage error={new NotFoundError()}></ErrorMessage>);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No recipe exists for this ID"
    );
  });

  it("renders the correct error message when the recipe ID is invalid", () => {
    render(<ErrorMessage error={new InvalidRequestError()}></ErrorMessage>);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This ID is in the wrong format"
    );
  });

  it("renders a generic error message when there is an unknown error", () => {
    render(<ErrorMessage error={new Error()}></ErrorMessage>);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load recipe, please try again later"
    );
  });
});
