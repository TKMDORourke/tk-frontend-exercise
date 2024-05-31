import { delay, http, HttpResponse } from "msw";
import server from "../../msw/server";
import { BASE_URL } from "../../config";
import { fetchAllUsers, createRecipe } from "./api";

describe("fetchAllUsers", () => {
  it("fetches all users", async () => {
    server.use(
      http.get(`${BASE_URL}/users`, () => {
        return HttpResponse.json(
          {
            users: [
              {
                id: "abc",
                name: "Test User",
                email: "testuser@test.com",
              },
            ],
          },
          { status: 200 }
        );
      })
    );

    const response = await fetchAllUsers();

    expect(response).toEqual({
      users: [
        {
          id: "abc",
          name: "Test User",
          email: "testuser@test.com",
        },
      ],
    });
  });
});

describe("createRecipe", () => {
  it("returns the recipe when it is successfully created", async () => {
    server.use(
      http.post(`${BASE_URL}/recipes`, () => {
        return HttpResponse.json(
          {
            id: "abc",
            name: "Test Recipe",
            author_id: "def",
          },
          { status: 201 }
        );
      })
    );

    const response = await createRecipe({
      name: "Test Recipe",
      author_id: "def",
    });

    expect(response).toEqual({
      id: "abc",
      name: "Test Recipe",
      author_id: "def",
    });
  });

  it("throws an error when the recipe is not successfully created", async () => {
    server.use(
      http.post(`${BASE_URL}/recipes`, () => {
        return HttpResponse.json({}, { status: 400 });
      })
    );

    await expect(createRecipe({ name: "", author_id: "" })).rejects.toThrow(
      Error
    );
  });

  it("throws an error if the request times out", async () => {
    jest.useFakeTimers({ doNotFake: ["queueMicrotask"] });
    server.use(
      http.post(`${BASE_URL}/recipes`, async () => {
        await delay(5000);
        return HttpResponse.json({}, { status: 200 });
      })
    );

    await expect(async () => {
      const promise = createRecipe({ name: "", author_id: "" });
      jest.advanceTimersByTime(5000);
      return await promise;
    }).rejects.toThrow("TimeoutError");
    jest.useRealTimers();
  });
});
