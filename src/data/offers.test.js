import { describe, it, expect } from "vitest";
import offers from "./offers";

describe("offers data", () => {
  it("has at least one offer", () => {
    expect(offers.length).toBeGreaterThan(0);
  });

  it.each(offers)("$title has a valid shape", (offer) => {
    expect(offer.id).toEqual(expect.any(String));
    expect(offer.title).toEqual(expect.any(String));
    expect(offer.image).toMatch(/^\/images\//);
  });

  it("has unique ids", () => {
    const ids = offers.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
