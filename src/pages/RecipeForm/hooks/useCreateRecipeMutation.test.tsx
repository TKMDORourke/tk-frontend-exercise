import { renderHook } from "@testing-library/react-hooks";
import useCreateRecipeMutation from "./useCreateRecipeMutation";
import { createRecipe } from "../api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

jest.mock("../api", () => ({
  createRecipe: jest.fn(),
}));

const mockCreateRecipe = jest.mocked(createRecipe);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const setupHook = () => {
  return renderHook(() => useCreateRecipeMutation(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe("useCreateRecipeMutation", () => {
  it("should call the create function with the correct parameters", async () => {
    const recipe = {
      id: "abc",
      name: "Test Recipe",
      author_id: "def",
    };
    mockCreateRecipe.mockResolvedValueOnce(recipe);

    const { result, waitFor } = setupHook();

    result.current.mutate({
      name: "Test Recipe",
      authorId: "def",
    });

    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith({
        name: "Test Recipe",
        author_id: "def",
      });
    });
  });

  it("should return the created recipe when creation is successful", async () => {
    const recipe = {
      id: "abc",
      name: "Test Recipe",
      author_id: "def",
    };
    mockCreateRecipe.mockResolvedValueOnce(recipe);

    const { result, waitFor } = setupHook();

    result.current.mutate({
      name: "Test Recipe",
      authorId: "def",
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: "abc",
        name: "Test Recipe",
        authorId: "def",
      });
    });
  });

  it("should invalidate the recipes cache when a new recipe is created", async () => {
    const spy = jest.spyOn(queryClient, "invalidateQueries");
    const recipe = {
      id: "abc",
      name: "Test Recipe",
      author_id: "def",
    };
    mockCreateRecipe.mockResolvedValueOnce(recipe);

    const { result, waitFor } = setupHook();

    result.current.mutate({
      name: "Test Recipe",
      authorId: "def",
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        queryKey: ["recipes"],
      });
    });
  });
});
