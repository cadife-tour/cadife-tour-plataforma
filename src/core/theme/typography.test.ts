import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { roboto } from "@/core/theme/fonts";

const read = (p: string) => readFileSync(p, "utf8");

describe("Tipografia do MVP", () => {
  it("carrega Roboto via next/font e a expõe em --font-sans/--font-heading com fallback sans-serif", () => {
    expect(roboto.variable).toBe("font-roboto");
    expect(read("src/app/layout.tsx")).toMatch(/className=\{roboto\.variable\}/);
    const tokens = read("src/core/theme/tokens.css");
    expect(tokens).toMatch(/--font-sans:\s*var\(--font-roboto(?:, Roboto)?\),[^;]*sans-serif;/);
    expect(tokens).toMatch(/--font-heading:\s*var\(--font-sans\);/);
  });

  it("não usa Fraunces nem Manrope", () => {
    for (const file of [
      "src/core/theme/fonts.ts",
      "src/core/theme/tokens.css",
      "src/app/layout.tsx",
    ]) {
      expect(read(file)).not.toMatch(/fraunces|manrope/i);
    }
  });
});
