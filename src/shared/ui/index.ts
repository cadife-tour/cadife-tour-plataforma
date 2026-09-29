import { Button } from "@/shared/ui/Button/Button";
import { Container } from "@/shared/ui/Container/Container";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";
import { SkipToContent } from "@/shared/ui/SkipToContent/SkipToContent";

export { Button, Container, LanguageSelector, SkipToContent };

/**
 * Public shared UI surface. Additions here must also have a library entry in
 * `catalog.tsx`; the catalog contract test keeps the two lists in sync.
 */
export const sharedUiComponents = {
  Button,
  Container,
  LanguageSelector,
  SkipToContent,
} as const;
