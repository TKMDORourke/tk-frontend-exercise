import "@testing-library/jest-dom";
import server from "./msw/server";

// Add polyfill for AbortSignal.timeout.
// https://github.com/jsdom/jsdom/issues/3516
if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException("TimeoutError")), ms);
    return controller.signal;
  };
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
