import { renderHook } from "@testing-library/react-hooks";
import useUsersQuery from "./useUsersQuery";
import { fetchAllUsers } from "../api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

jest.mock("../api", () => ({
  fetchAllUsers: jest.fn(),
}));

const mockFetchAllUsers = jest.mocked(fetchAllUsers);

const setupHook = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return renderHook(() => useUsersQuery(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe("useUsersQuery", () => {
  it("should return all available users", async () => {
    const users = [
      {
        id: "abc",
        name: "Test User",
        email: "testuser@test.com",
      },
    ];
    mockFetchAllUsers.mockResolvedValueOnce({
      users: users,
    });

    const { result, waitFor } = setupHook();

    await waitFor(() => {
      expect(result.current.users).toEqual([
        {
          id: "abc",
          name: "Test User",
          email: "testuser@test.com",
        },
      ]);
    });
  });
});
