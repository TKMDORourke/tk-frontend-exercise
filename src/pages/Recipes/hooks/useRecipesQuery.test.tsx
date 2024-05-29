import { renderHook } from "@testing-library/react-hooks";
import useRecipesQuery from "./useRecipesQuery";
import { fetchAllRecipes } from "../api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

jest.mock("../api", () => ({
  fetchAllRecipes: jest.fn(),
}));

const mockFetchAllRecipes = jest.mocked(fetchAllRecipes);

const setupHook = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return renderHook(() => useRecipesQuery(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe("useRecipesQuery", () => {
  it("should return all available recipes", async () => {
    const recipes = [
      {
        id: "abc",
        name: "Test Recipe",
        author_id: "def",
      },
    ];
    mockFetchAllRecipes.mockResolvedValueOnce({
      recipes: recipes,
    });

    const { result, waitFor } = setupHook();

    await waitFor(() => {
      expect(result.current.recipes).toEqual([{
        id: "abc",
        name: "Test Recipe",
        authorId: "def",
      }]);
    });
  });
});
