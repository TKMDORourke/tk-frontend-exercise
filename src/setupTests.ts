import "@testing-library/jest-dom";

// Add polyfill for AbortSignal.timeout.
// https://github.com/jsdom/jsdom/issues/3516
if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException("TimeoutError")), ms);
    return controller.signal;
  };
}
