import { describe, it, expect, spyOn } from "bun:test";
import { info, warn, error, success } from "../../src/utils/logger";

describe("logger", () => {
  it("info does not throw", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {});
    expect(() => info("hello")).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("warn does not throw", () => {
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    expect(() => warn("caution")).not.toThrow();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("error does not throw", () => {
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    expect(() => error("oops")).not.toThrow();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("success does not throw", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {});
    expect(() => success("done")).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
