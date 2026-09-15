import { describe, it, expect } from "vitest";
import team from "./team";

describe("team data", () => {
  it("has at least one member", () => {
    expect(team.length).toBeGreaterThan(0);
  });

  it.each(team)("$name has a valid shape", (member) => {
    expect(member.id).toEqual(expect.any(String));
    expect(member.name).toEqual(expect.any(String));
    expect(member.role).toEqual(expect.any(String));
    expect(member.image).toMatch(/^\/images\/team\//);
    expect(member.hoverImage).toMatch(/^\/images\/team\//);
  });

  it("has unique ids", () => {
    const ids = team.map((member) => member.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
