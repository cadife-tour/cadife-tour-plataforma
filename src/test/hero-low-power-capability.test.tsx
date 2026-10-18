import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";

describe("Hero and background capability", () => {
  afterEach(() => vi.restoreAllMocks());

  it("disables the decorative WebGL layer on a two-core device", () => {
    vi.spyOn(navigator, "hardwareConcurrency", "get").mockReturnValue(2);
    const contextProbe = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockImplementation(() => null);

    const { result } = renderHook(() => useGpuCapability());

    expect(result.current.isConstrainedDevice).toBe(true);
    expect(result.current.canRender3D).toBe(false);
    expect(contextProbe).not.toHaveBeenCalled();
  });
});
