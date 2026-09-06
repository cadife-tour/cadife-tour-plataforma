"use client";

import React from "react";
import CursorRevealPoc from "@/app/cursor-reveal-poc/CursorRevealPoc";

interface WebGLRevealHeroProps {
  imageOfficeSrc?: string;
  imageParadiseSrc?: string;
}

export const WebGLRevealHero: React.FC<WebGLRevealHeroProps> = ({
  imageOfficeSrc = "/demo-ln4/office-original.png",
  imageParadiseSrc = "/demo-ln4/paradise-original.png",
}) => <CursorRevealPoc imageOfficeSrc={imageOfficeSrc} imageParadiseSrc={imageParadiseSrc} />;
