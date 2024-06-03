import { http, HttpResponse } from "msw";
import server from "../msw/server";
import { BASE_URL } from "../config";
import { fetchRecipe } from "./api";
import { InvalidRequestError, NotFoundError } from "./exceptions";

describe("fetchRecipe", () => {
  it("fetches the given recipe", async () => {
    const mockRecipe = {
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

    server.use(
      http.get(`${BASE_URL}/recipes/abc`, () => {
        return HttpResponse.json(mockRecipe, { status: 200 });
      })
    );

    const response = await fetchRecipe("abc");

    expect(response).toEqual(mockRecipe);
  });

  it("throws the correct error if the recipe cannot be found", async () => {
    server.use(
      http.get(`${BASE_URL}/recipes/abc`, () => {
        return HttpResponse.json(
          { error: { type: "not_found" } },
          { status: 404 }
        );
      })
    );

    await expect(fetchRecipe("abc")).rejects.toThrow(NotFoundError);
  });

  it("throws the correct error if the given ID is invalid", async () => {
    server.use(
      http.get(`${BASE_URL}/recipes/abc`, () => {
        return HttpResponse.json(
          { error: { type: "validation_error" } },
          { status: 400 }
        );
      })
    );

    await expect(fetchRecipe("abc")).rejects.toThrow(InvalidRequestError);
  });

  it("throws a generic error if there is an unforeseen error", async () => {
    server.use(
      http.get(`${BASE_URL}/recipes/abc`, () => {
        return HttpResponse.json({}, { status: 500 });
      })
    );

    await expect(fetchRecipe("abc")).rejects.toThrow(Error);
  });
});
