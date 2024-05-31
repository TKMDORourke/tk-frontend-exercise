import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RecipeForm from "./RecipeForm";
import { MemoryRouter, Route } from "react-router-dom";

const mockUseUsersQuery = jest.fn();
const mockUseCreateRecipeMutation = jest.fn();

jest.mock("./hooks", () => {
  const originalModule = jest.requireActual("./hooks");
  return {
    ...originalModule,
    useUsersQuery: () => mockUseUsersQuery(),
    useCreateRecipeMutation: () => mockUseCreateRecipeMutation(),
  };
});

describe("Users", () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <RecipeForm />
        <Route path="/recipes/abc">Recipe created</Route>
      </MemoryRouter>
    );
  };

  it("renders a form to create a new recipe", () => {
    mockUseUsersQuery.mockReturnValue({
      isLoading: false,
      users: [],
    });

    renderComponent();

    expect(screen.getByRole("textbox", { name: "Name:" })).toBeInTheDocument();
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

    renderComponent();

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

    renderComponent();

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

    renderComponent();

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
