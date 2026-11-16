import { Button } from "@/shared/ui/Button/Button";
import { Container } from "@/shared/ui/Container/Container";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";
import { SkipToContent } from "@/shared/ui/SkipToContent/SkipToContent";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta/WhatsAppCta";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Card } from "@/shared/ui/Card/Card";
import { TextField } from "@/shared/ui/TextField/TextField";
import { LiquidGlassSurface } from "@/shared/ui/LiquidGlass/LiquidGlassSurface";
import { PassportStamp } from "@/shared/ui/travel/PassportStamp";
import { PostageStamp } from "@/shared/ui/travel/PostageStamp";
import { BoardingPass } from "@/shared/ui/travel/BoardingPass";
import { TravelEyebrow } from "@/shared/ui/travel/TravelEyebrow";

export {
  Badge,
  BoardingPass,
  Button,
  Card,
  Container,
  LanguageSelector,
  LiquidGlassSurface,
  PassportStamp,
  PostageStamp,
  SkipToContent,
  TextField,
  TravelEyebrow,
  WhatsAppCta,
};

/**
 * Public shared UI surface. Additions here must also have a library entry in
 * `catalog.tsx`; the catalog contract test keeps the two lists in sync.
 */
export const sharedUiComponents = {
  Button,
  Container,
  LanguageSelector,
  SkipToContent,
  WhatsAppCta,
  Badge,
  Card,
  TextField,
  LiquidGlassSurface,
  PassportStamp,
  PostageStamp,
  BoardingPass,
  TravelEyebrow,
} as const;
