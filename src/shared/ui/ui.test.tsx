import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/shared/ui/Button/Button";
import { Container } from "@/shared/ui/Container/Container";
import { SkipToContent } from "@/shared/ui/SkipToContent/SkipToContent";

describe("Shared UI Primitives", () => {
  it("renders Button correctly with accessible role", () => {
    render(<Button>Falar com Consultor</Button>);
    const button = screen.getByRole("button", { name: /falar com consultor/i });
    expect(button).toBeInTheDocument();
  });

  it("renders Container with children and correct sizing", () => {
    render(
      <Container size="lg" data-testid="container-el">
        <span>Conteúdo</span>
      </Container>
    );
    expect(screen.getByTestId("container-el")).toHaveClass("max-w-7xl");
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("renders SkipToContent link targeting #main-content", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link", { name: /pular para o conteúdo principal/i });
    expect(link).toHaveAttribute("href", "#main-content");
  });
});
