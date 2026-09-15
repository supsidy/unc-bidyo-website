import { describe, it, expect, afterEach } from "vitest";
import { preloadImage } from "./preloadImages";

describe("preloadImage", () => {
  const OriginalImage = global.Image;

  afterEach(() => {
    global.Image = OriginalImage;
  });

  it("resolves once the image loads successfully", async () => {
    global.Image = class {
      set src(_value) {
        queueMicrotask(() => this.onload?.());
      }
    };

    await expect(
      preloadImage("/images/hero/hero.png")
    ).resolves.toBeUndefined();
  });

  it("resolves even if the image fails to load, so the caller is never blocked", async () => {
    global.Image = class {
      set src(_value) {
        queueMicrotask(() => this.onerror?.());
      }
    };

    await expect(preloadImage("/images/missing.png")).resolves.toBeUndefined();
  });
});
