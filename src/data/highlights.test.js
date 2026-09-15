import { describe, it, expect } from "vitest";
import highlights from "./highlights";

describe("highlights data", () => {
  it("has at least one group", () => {
    expect(highlights.length).toBeGreaterThan(0);
  });

  it.each(highlights)("group $id has only absolute image paths", (group) => {
    expect(group.images.length).toBeGreaterThan(0);
    for (const image of group.images) {
      expect(image).toMatch(/^\/images\/highlights\//);
    }
  });

  it("has unique group ids", () => {
    const ids = highlights.map((group) => group.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
