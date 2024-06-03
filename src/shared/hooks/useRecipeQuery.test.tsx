import { renderHook } from "@testing-library/react-hooks";
import useRecipeQuery from "./useRecipeQuery";
import { fetchRecipe } from "../api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

jest.mock("../api", () => ({
  fetchRecipe: jest.fn(),
}));

const mockFetchRecipe = jest.mocked(fetchRecipe);

const setupHook = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return renderHook(() => useRecipeQuery("abc"), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe("useRecipeQuery", () => {
  it("should return the recipe for the given ID", async () => {
    const recipe = {
      id: "abc",
      name: "Test Recipe",
      author_id: "def",
      author_name: "Test User",
      ingredients: [
        {
          id: "ghi",
          name: "Onion",
        },
      ],
    };
    mockFetchRecipe.mockResolvedValueOnce(recipe);

    const { result, waitFor } = setupHook();

    await waitFor(() => {
      expect(result.current.recipe).toEqual({
        id: "abc",
        name: "Test Recipe",
        authorId: "def",
        authorName: "Test User",
        ingredients: [
          {
            id: "ghi",
            name: "Onion",
          },
        ],
      });
    });
  });
});
