import type { ReactNode } from "react";
import { clsx } from "clsx";

export interface PostageStampProps {
  children: ReactNode;
  /** Valor impresso no canto, como num selo real (ex.: "CDF 26"). */
  denomination?: string;
  /** Inclinação em graus. */
  rotate?: number;
  className?: string;
}

/**
 * Moldura de selo postal com borda picotada em papel de passaporte.
 * A sombra fica no wrapper porque a máscara do picote recortaria um drop-shadow interno.
 */
export function PostageStamp({ children, denomination, rotate = 0, className }: PostageStampProps) {
  return (
    <div
      className={clsx(
        "drop-shadow-[0_14px_22px_rgba(26,10,8,0.5)] transition-transform duration-500 ease-expressive motion-reduce:transition-none",
        className
      )}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <div className="postage-stamp relative">
        <div className="relative overflow-hidden">{children}</div>
        {denomination && (
          <span
            aria-hidden="true"
            className="absolute bottom-[14px] right-[16px] rounded-sm bg-paper/90 px-1.5 py-0.5 font-heading text-[11px] font-bold leading-none text-brand-dark"
          >
            {denomination}
          </span>
        )}
      </div>
    </div>
  );
}
