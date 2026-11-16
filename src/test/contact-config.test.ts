import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Confirmed business contacts", () => {
  it("uses the official phone in production without an environment override", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", undefined);
    vi.resetModules();
    const { contactInfo } = await import("@/content/data");
    const { createWhatsAppUrl } = await import("@/shared/utils/whatsapp");
    expect(contactInfo.whatsappNumber).toBe("5547996714510");
    expect(contactInfo.isWhatsappNumberPending).toBe(false);
    expect(contactInfo.email).toBe("contato@cadifetour.com");
    expect(createWhatsAppUrl({ source: "hero" })).toMatch(/^https:\/\/wa.me\/5547996714510\?/);
  });

  it.each(["", "5500000000000"])(
    "keeps invalid explicit configuration %j on contact fallback",
    async (phone) => {
      vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", phone);
      vi.resetModules();
      const { createWhatsAppUrl } = await import("@/shared/utils/whatsapp");
      expect(createWhatsAppUrl({ source: "hero" })).toBe("#contato");
    }
  );

  it("preserves a valid environment override", async () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "5511999998888");
    vi.resetModules();
    const { createWhatsAppUrl } = await import("@/shared/utils/whatsapp");
    expect(createWhatsAppUrl({ source: "hero" })).toMatch(/^https:\/\/wa.me\/5511999998888\?/);
  });
});
