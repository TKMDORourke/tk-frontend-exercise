import { renderHook } from "@testing-library/react-hooks";
import useUpdateRecipeMutation from "./useUpdateRecipeMutation";
import { updateRecipe } from "../api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

jest.mock("../api", () => ({
  updateRecipe: jest.fn(),
}));

const mockUpdateRecipe = jest.mocked(updateRecipe);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const setupHook = () => {
  return renderHook(() => useUpdateRecipeMutation(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe("useUpdateRecipeMutation", () => {
  it("should call the update function with the correct parameters", async () => {
    mockUpdateRecipe.mockResolvedValueOnce(undefined);

    const { result, waitFor } = setupHook();

    result.current.mutate({
      id: "abc",
      name: "Test Recipe",
      authorId: "def",
      ingredients: [],
    });

    await waitFor(() => {
      expect(mockUpdateRecipe).toHaveBeenCalledWith("abc", {
        name: "Test Recipe",
        author_id: "def",
        ingredients: [],
      });
    });
  });

  it("should invalidate the recipes cache when a recipe is updated", async () => {
    const spy = jest.spyOn(queryClient, "invalidateQueries");
    mockUpdateRecipe.mockResolvedValueOnce(undefined);

    const { result, waitFor } = setupHook();

    result.current.mutate({
      id: "abc",
      name: "",
      authorId: "",
      ingredients: [],
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        queryKey: ["recipes"],
      });
    });
  });
});
