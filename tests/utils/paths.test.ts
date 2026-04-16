import { describe, it, expect } from "bun:test";
import {
  getRootPath,
  getWarehousePath,
  getManifestPath,
  getRuntimePath,
} from "../../src/utils/paths";

describe("paths", () => {
  it("getRootPath() resolves to repo root ending with hk-skills", () => {
    const root = getRootPath();
    expect(root.endsWith("hk-skills")).toBe(true);
  });

  it("getWarehousePath() returns correct path for each type", () => {
    const root = "/fake/root";
    expect(getWarehousePath(root, "remote")).toEndWith("warehouse/remote");
    expect(getWarehousePath(root, "adapted")).toEndWith("warehouse/adapted");
    expect(getWarehousePath(root, "local")).toEndWith("warehouse/local");
  });

  it("getManifestPath() returns yaml file path", () => {
    expect(getManifestPath("/fake/root", "foo")).toEndWith(
      "manifests/foo.yaml"
    );
  });

  it("getRuntimePath() returns global path when scope is global", () => {
    expect(getRuntimePath("/fake/root", "global")).toEndWith("runtime/global");
  });

  it("getRuntimePath() returns project path when scope is an object", () => {
    expect(getRuntimePath("/fake/root", { project: "my-project" })).toEndWith(
      "runtime/projects/my-project"
    );
  });

  it("getRuntimePath() encodes absolute project paths under runtime/projects", () => {
    const result = getRuntimePath("/fake/root", { project: "/absolute/path/to/my-app" });
    expect(result.startsWith("/fake/root/runtime/projects/")).toBe(true);
    expect(result).not.toContain("/absolute/path/to/my-app");
  });

  it("getRuntimePath() encodes relative project paths with dot and trailing slash", () => {
    const result = getRuntimePath("/fake/root", { project: "./my-app/" });
    expect(result.startsWith("/fake/root/runtime/projects/")).toBe(true);
    expect(result).not.toContain("./my-app/");
  });

  it("getRuntimePath() encodes paths with spaces", () => {
    const result = getRuntimePath("/fake/root", { project: "/my projects/app" });
    expect(result.startsWith("/fake/root/runtime/projects/")).toBe(true);
    expect(result).not.toContain("/my projects/app");
  });

  it("getRuntimePath() produces distinct encoded ids for same basename in different directories", () => {
    const a = getRuntimePath("/fake/root", { project: "/work/a/client" });
    const b = getRuntimePath("/fake/root", { project: "/work/b/client" });
    expect(a).not.toBe(b);
    expect(a.startsWith("/fake/root/runtime/projects/")).toBe(true);
    expect(b.startsWith("/fake/root/runtime/projects/")).toBe(true);
  });
});
