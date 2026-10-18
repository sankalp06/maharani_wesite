type LogoProps = {
  className?: string;
  variant?: "full" | "mark";
  tone?: "color" | "light";
};

export function Logo({ className = "", variant = "full", tone = "color" }: LogoProps) {
  const primary = tone === "light" ? "#F3DDE0" : "#7A1F3D";
  const gold = tone === "light" ? "#E4C77E" : "#C9A24B";

  const mark = (
    <svg viewBox="0 0 64 64" className="h-full w-auto" aria-hidden="true">
      <path
        d="M10 40 L16 22 L24 34 L32 16 L40 34 L48 22 L54 40"
        fill="none"
        stroke={gold}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="22" r="2.6" fill={gold} />
      <circle cx="32" cy="16" r="3" fill={gold} />
      <circle cx="48" cy="22" r="2.6" fill={gold} />
      <path
        d="M9 44 H55"
        stroke={primary}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M9 49 H55"
        stroke={primary}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );

  if (variant === "mark") {
    return <span className={className}>{mark}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="h-8 w-8 shrink-0">{mark}</span>
      <span className="flex flex-col leading-none">
        <span
          className="font-serif text-xl sm:text-2xl tracking-wide"
          style={{ color: primary }}
        >
          Maharani
        </span>
        <span
          className="text-[0.55rem] sm:text-[0.6rem] font-sans tracking-wide-xl uppercase"
          style={{ color: gold }}
        >
          Boutique
        </span>
      </span>
    </span>
  );
}
