import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CADIFE TOUR × ESCAPE — The Shift Experience",
  description:
    "Uma experiência imersiva de transição entre o escritório corporativo e a liberdade no paraíso. Design inspirado no estilo de alta octanagem de Lando Norris.",
};

export default function DemoEscapeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#080d09] text-white selection:bg-[#d2ff00] selection:text-black">
      {children}
    </div>
  );
}
