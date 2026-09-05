/** Lightweight decorative SVG; never intercepts navigation or reading. */
export function SectionArt({ variant = "workspace", className = "absolute left-[28%] top-7 hidden w-44 opacity-60 xl:block" }: { variant?: "workspace" | "path" | "conversation" | "feedback"; className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 240 160" className={`section-art pointer-events-none ${className}`} fill="none">
      {variant === "workspace" ? (
        <>
          <g transform="rotate(-7 115 85)">
            <rect x="34" y="32" width="154" height="106" rx="12" fill="#d3eff9" />
            <rect x="28" y="25" width="154" height="106" rx="12" fill="#fff" stroke="#aee2ef" />
            <path d="M29 48h152" stroke="#d1edf5" />
            <circle cx="40" cy="37" r="3" fill="#29b6d3" />
            <circle cx="51" cy="37" r="3" fill="#a7e5f0" />
            <circle cx="62" cy="37" r="3" fill="#d4f3f8" />
            <rect x="40" y="60" width="55" height="56" rx="7" fill="#dbf4fb" />
            <path d="m47 105 15-22 11 12 9-7 8 17Z" fill="#70cce5" />
            <path d="M108 66h57m-57 13h43m-43 13h49" stroke="#b5dfea" strokeWidth="5" strokeLinecap="round" />
            <rect x="107" y="105" width="35" height="10" rx="5" fill="#35bed7" />
          </g>
          <g className="art-float">
            <rect x="162" y="82" width="56" height="43" rx="9" fill="#edfaff" stroke="#aee2ef" />
            <path d="m173 106 6-6 7 7 15-15" stroke="#29b6d3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </>
      ) : variant === "conversation" ? (
        <>
          <g transform="rotate(-6 110 80)">
            <path d="M39 30h125a12 12 0 0 1 12 12v60a12 12 0 0 1-12 12H78l-27 20 4-20H39a12 12 0 0 1-12-12V42a12 12 0 0 1 12-12Z" fill="#fff" stroke="#aee2ef" />
            <path d="M49 57h20v18H57c0 8-3 12-9 15m37-33h20v18H93c0 8-3 12-9 15" fill="#b9eaf6" />
            <path d="M119 60h35m-35 14h25" stroke="#c2e7f1" strokeWidth="5" strokeLinecap="round" />
          </g>
          <g className="art-float">
            <path d="M128 89h77a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10h-9l3 15-23-15h-48a10 10 0 0 1-10-10V99a10 10 0 0 1 10-10Z" fill="#dcf6fc" stroke="#9edcec" />
            <circle cx="144" cy="112" r="4" fill="#36bad5" />
            <circle cx="165" cy="112" r="4" fill="#73cde2" />
            <circle cx="186" cy="112" r="4" fill="#a1deeb" />
          </g>
        </>
      ) : variant === "feedback" ? (
        <>
          <g transform="rotate(6 120 80)">
            <rect x="48" y="20" width="138" height="128" rx="13" fill="#d8f0f8" />
            <rect x="42" y="14" width="138" height="128" rx="13" fill="#fff" stroke="#aee2ef" />
            <rect x="80" y="9" width="60" height="16" rx="7" fill="#bceaf5" />
            <path d="m65 51 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Zm35 0 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Zm35 0 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z" fill="#78cfe3" />
            <path d="M62 94h95m-95 14h78m-78 14h51" stroke="#c2e7f1" strokeWidth="5" strokeLinecap="round" />
          </g>
          <g className="art-float" transform="rotate(25 188 95)">
            <path d="m171 117 22-68 11 4-22 68-11 10Z" fill="#54bfdc" />
            <path d="m171 117 11 4-11 10Z" fill="#b9eaf6" />
            <path d="m193 49 3-8a6 6 0 0 1 11 4l-3 8Z" fill="#a3e3f2" />
          </g>
        </>
      ) : (
        <>
          <g className="art-float" strokeLinejoin="round">
            <path d="M30 132C80 132 112 93 158 68" stroke="#95d8eb" strokeWidth="1.5" strokeDasharray="4 6" />
            <path d="m124 50 82-23-36 72-12-31Z" fill="#73d4ef" />
            <path d="m158 68 48-41-36 72Z" fill="#24a9d3" />
            <path d="m124 50 82-23-48 41Z" fill="#b6eeff" />
          </g>
        </>
      )}
    </svg>
  );
}
