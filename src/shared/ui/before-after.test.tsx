import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { metadata } from "@/app/design-system/antes-e-depois/page";
import { DesignSystemBeforeAfter } from "@/shared/ui/DesignSystemBeforeAfter";

describe("Design system before/after page", () => {
  it("stays out of search engines", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("pairs every comparison with a before and an after pane", () => {
    render(<DesignSystemBeforeAfter />);

    const sections = screen.getAllByRole("region");
    expect(sections).toHaveLength(6);
    expect(screen.getAllByText("Antes · v1")).toHaveLength(6);
    expect(screen.getAllByText("Depois · v2")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /voltar à biblioteca/i })).toHaveAttribute(
      "href",
      "/design-system"
    );
  });
});
