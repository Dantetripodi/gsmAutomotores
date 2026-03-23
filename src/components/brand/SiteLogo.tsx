import { LOGO_ALT, LOGO_SRC } from "../../config/branding";

type Props = {
  className?: string;
  compact?: boolean;
};

export function SiteLogo({ className = "", compact = false }: Props) {
  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={compact ? 36 : 44}
      height={compact ? 36 : 44}
      className={`object-contain shrink-0 ${compact ? "h-9 w-9" : "h-10 w-10 md:h-11 md:w-11"} ${className}`}
      decoding="async"
    />
  );
}
