import { delay, http, HttpResponse } from "msw";
import server from "../../msw/server";
import { BASE_URL } from "../../config";
import { fetchAllUsers, createRecipe, updateRecipe } from "./api";
import { NotFoundError } from "../../shared/exceptions";

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

describe("updateRecipe", () => {
  it("calls the server with the correct parameters", async () => {
    let requestBody;

    server.use(
      http.put(`${BASE_URL}/recipes/abc`, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(undefined, { status: 204 });
      })
    );

    await updateRecipe("abc", {
      name: "Test Recipe 1",
      author_id: "def",
      ingredients: ["Onion", "Carrot"],
    });

    expect(requestBody).toEqual({
      name: "Test Recipe 1",
      author_id: "def",
      ingredients: ["Onion", "Carrot"],
    });
  });

  it("throws a not found exception when the recipe to update is not found", async () => {
    server.use(
      http.put(`${BASE_URL}/recipes/abc`, () => {
        return HttpResponse.json(undefined, { status: 404 });
      })
    );

    await expect(
      updateRecipe("abc", {
        name: "Test Recipe",
        author_id: "def",
        ingredients: [],
      })
    ).rejects.toThrow(NotFoundError);
  });

  it("throws an error when the recipe is not successfully updated", async () => {
    server.use(
      http.put(`${BASE_URL}/recipes/abc`, () => {
        return HttpResponse.json(undefined, { status: 400 });
      })
    );

    await expect(
      updateRecipe("abc", {
        name: "Test Recipe",
        author_id: "def",
        ingredients: [],
      })
    ).rejects.toThrow(Error);
  });

  it("throws an error if the request times out", async () => {
    jest.useFakeTimers({ doNotFake: ["queueMicrotask"] });
    server.use(
      http.put(`${BASE_URL}/recipes/abc`, async () => {
        await delay(5000);
        return HttpResponse.json(undefined, { status: 204 });
      })
    );

    await expect(async () => {
      const promise = updateRecipe("abc", {
        name: "Test Recipe",
        author_id: "def",
        ingredients: [],
      });
      jest.advanceTimersByTime(5000);
      return await promise;
    }).rejects.toThrow("TimeoutError");
    jest.useRealTimers();
  });
});
