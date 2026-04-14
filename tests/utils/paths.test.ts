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
});
