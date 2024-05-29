import { http, HttpResponse } from "msw";
import server from "../../msw/server";
import { BASE_URL } from "../../config";
import { fetchAllRecipes } from "./api";

describe("fetchAllRecipes", () => {
  it("fetches all recipes", async () => {
    server.use(
      http.get(`${BASE_URL}/recipes`, () => {
        return HttpResponse.json(
          {
            recipes: [
              {
                id: "abc",
                name: "Test Recipe",
                author_id: "def",
              },
            ],
          },
          { status: 200 }
        );
      })
    );

    const response = await fetchAllRecipes();

    expect(response).toEqual({
      recipes: [
        {
          id: "abc",
          name: "Test Recipe",
          author_id: "def",
        },
      ],
    });
  });
});
