import React from "react";

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-background focus:shadow-lg focus:outline-none"
    >
      Pular para o conteúdo principal
    </a>
  );
};
