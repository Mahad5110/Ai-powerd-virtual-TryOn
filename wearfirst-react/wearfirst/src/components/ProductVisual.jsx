import React from 'react'

export default function ProductVisual({
  category = 'Watches',
  variant = 1,
  accentHex = '#D4D4D8',
  size = 110,
  stroke = '#9B978D',
}) {
  const uid = `${category}-${variant}-${accentHex.replace('#', '')}`

  if (category === 'Watches') {
    return (
      <svg
        viewBox="0 0 140 140"
        width={size}
        height={size}
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`dial-${uid}`} cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor={accentHex} stopOpacity="0.28" />
            <stop offset="100%" stopColor="#141413" stopOpacity="0.9" />
          </radialGradient>
        </defs>
        {/* Top & bottom strap / bracelet */}
        <path d="M53 10h34l3 24H50l3-24Z" fill={accentHex} fillOpacity="0.08" />
        <path d="M50 106h40l-3 24H53l-3-24Z" fill={accentHex} fillOpacity="0.08" />
        <path d="M55 18h30M54 26h32M54 114h32M55 122h30" strokeOpacity="0.45" />

        {variant === 2 ? (
          /* Rectangular Dress Tank */
          <>
            <rect
              x="42"
              y="32"
              width="56"
              height="76"
              rx="6"
              fill={`url(#dial-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <rect x="49" y="40" width="42" height="60" rx="2" strokeOpacity="0.6" />
            <rect x="98" y="64" width="5" height="12" rx="1.5" fill={accentHex} />
            <path d="M70 45v6M70 89v6M54 70h5M81 70h5" stroke={accentHex} />
            <path d="M70 70V53M70 70l11 7" stroke="#ECE9E2" strokeWidth="1.8" />
          </>
        ) : variant === 3 ? (
          /* Bi-Compax Chronograph */
          <>
            <circle
              cx="70"
              cy="70"
              r="36"
              fill={`url(#dial-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <circle cx="70" cy="70" r="30" strokeOpacity="0.55" />
            <rect x="106" y="65" width="5" height="10" rx="1" fill={accentHex} />
            <path d="M103 52l5-3M103 88l5 3" stroke={accentHex} strokeWidth="2" />
            <circle cx="58" cy="70" r="7" strokeOpacity="0.75" />
            <circle cx="82" cy="70" r="7" strokeOpacity="0.75" />
            <path d="M70 43v4M70 93v4" stroke={accentHex} />
            <path d="M70 70V50M70 70l13 8" stroke="#ECE9E2" strokeWidth="1.8" />
          </>
        ) : variant === 4 ? (
          /* Skeleton / Openworked */
          <>
            <circle
              cx="70"
              cy="70"
              r="35"
              fill={`url(#dial-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <polygon
              points="70,41 95,55 95,85 70,99 45,85 45,55"
              strokeOpacity="0.5"
            />
            <circle cx="70" cy="70" r="14" stroke={accentHex} strokeDasharray="3 3" />
            <circle cx="70" cy="58" r="5" strokeOpacity="0.7" />
            <path d="M70 70V51M70 70l12 6" stroke="#ECE9E2" strokeWidth="1.8" />
          </>
        ) : (
          /* Classic Integrated Automatic + Moonphase */
          <>
            <circle
              cx="70"
              cy="70"
              r="35"
              fill={`url(#dial-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <circle cx="70" cy="70" r="28" strokeOpacity="0.55" />
            <rect x="105" y="65" width="5" height="10" rx="1.5" fill={accentHex} />
            <path d="M70 45v5M70 90v5M45 70h5M90 70h5" stroke={accentHex} />
            <path d="M62 82a9 9 0 0 1 16 0" stroke={accentHex} strokeOpacity="0.8" />
            <path d="M70 70V51M70 70l12 7" stroke="#ECE9E2" strokeWidth="1.8" />
            <circle cx="70" cy="70" r="2.2" fill="#ECE9E2" />
          </>
        )}
      </svg>
    )
  }

  if (category === 'Jewelry') {
    return (
      <svg
        viewBox="0 0 140 140"
        width={size}
        height={size}
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`gem-${uid}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor={accentHex} stopOpacity="0.35" />
            <stop offset="100%" stopColor="#141413" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {variant === 2 ? (
          /* Sculpted Torque Cuff / Pendant */
          <>
            <path
              d="M42 86a34 32 0 1 1 56 0"
              stroke={accentHex}
              strokeWidth="3.5"
            />
            <path
              d="M46 82a29 27 0 1 1 48 0"
              strokeOpacity="0.45"
            />
            <circle cx="44" cy="90" r="7" fill={`url(#gem-${uid})`} stroke={accentHex} strokeWidth="1.6" />
            <circle cx="96" cy="90" r="7" fill={`url(#gem-${uid})`} stroke={accentHex} strokeWidth="1.6" />
            <polygon points="70,22 77,31 70,40 63,31" fill={`url(#gem-${uid})`} stroke="#ECE9E2" />
          </>
        ) : variant === 3 ? (
          /* Pavé Dome / Link */
          <>
            <ellipse
              cx="70"
              cy="78"
              rx="34"
              ry="26"
              fill={`url(#gem-${uid})`}
              stroke={accentHex}
              strokeWidth="2"
            />
            <ellipse cx="70" cy="81" rx="25" ry="18" strokeOpacity="0.6" />
            <path d="M46 62c14-14 34-14 48 0" stroke="#ECE9E2" strokeWidth="1.6" />
            <circle cx="58" cy="56" r="2.2" fill="#ECE9E2" />
            <circle cx="70" cy="53" r="2.6" fill="#ECE9E2" />
            <circle cx="82" cy="56" r="2.2" fill="#ECE9E2" />
          </>
        ) : variant === 4 ? (
          /* Interlock / Onyx Signet */
          <>
            <circle cx="62" cy="76" r="26" stroke={accentHex} strokeWidth="2" />
            <circle cx="78" cy="72" r="26" stroke="#ECE9E2" strokeOpacity="0.75" strokeWidth="1.6" />
            <rect
              x="54"
              y="36"
              width="32"
              height="16"
              rx="3"
              fill={`url(#gem-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
          </>
        ) : (
          /* Solitaire / Emerald Cut Signet */
          <>
            <circle
              cx="70"
              cy="82"
              r="30"
              fill={`url(#gem-${uid})`}
              stroke={accentHex}
              strokeWidth="2"
            />
            <circle cx="70" cy="82" r="23" strokeOpacity="0.55" />
            <polygon
              points="70,20 88,38 70,56 52,38"
              fill={`url(#gem-${uid})`}
              stroke="#ECE9E2"
              strokeWidth="1.6"
            />
            <path d="M52 38h36M70 20v36" strokeOpacity="0.45" />
          </>
        )}
      </svg>
    )
  }

  if (category === 'Bags') {
    return (
      <svg
        viewBox="0 0 140 140"
        width={size}
        height={size}
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`bag-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentHex} stopOpacity="0.26" />
            <stop offset="100%" stopColor="#141413" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {variant === 2 ? (
          /* Soft Crescent Hobo / Bucket */
          <>
            <path
              d="M40 52c0-26 60-26 60 0"
              stroke={accentHex}
              strokeWidth="2"
            />
            <path
              d="M30 52c16 14 64 14 80 0l-8 56c-6 10-58 10-64 0l-8-56Z"
              fill={`url(#bag-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <circle cx="40" cy="52" r="3.5" fill="#ECE9E2" />
            <circle cx="100" cy="52" r="3.5" fill="#ECE9E2" />
          </>
        ) : variant === 3 ? (
          /* East-West Gallery Tote / Weekender */
          <>
            <path d="M48 52V30c0-8 44-8 44 0v22" stroke={accentHex} strokeWidth="1.8" />
            <rect
              x="22"
              y="52"
              width="96"
              height="60"
              rx="5"
              fill={`url(#bag-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <path d="M22 72h96" strokeOpacity="0.55" />
            <path d="M48 52v60M92 52v60" strokeOpacity="0.4" />
            <rect x="65" y="68" width="10" height="8" rx="1.5" fill="#ECE9E2" />
          </>
        ) : variant === 4 ? (
          /* Pleated Clutch / Origami Messenger */
          <>
            <path d="M46 50l24-22 24 22" stroke={accentHex} strokeDasharray="3 3" />
            <rect
              x="26"
              y="50"
              width="88"
              height="54"
              rx="8"
              fill={`url(#bag-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <path d="M26 56l44 26 44-26" stroke="#ECE9E2" strokeWidth="1.5" />
            <circle cx="70" cy="82" r="3.5" fill={accentHex} />
          </>
        ) : (
          /* Structured Trapezoid Top-Handle */
          <>
            <path d="M50 50c0-24 40-24 40 0" stroke={accentHex} strokeWidth="2" />
            <polygon
              points="34,50 106,50 114,112 26,112"
              fill={`url(#bag-${uid})`}
              stroke={accentHex}
              strokeWidth="1.6"
            />
            <path d="M31 74h78" strokeOpacity="0.6" />
            <rect x="65" y="70" width="10" height="10" rx="2" fill="#ECE9E2" />
          </>
        )}
      </svg>
    )
  }

  // Shoes
  return (
    <svg
      viewBox="0 0 140 140"
      width={size}
      height={size}
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`shoe-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentHex} stopOpacity="0.28" />
          <stop offset="100%" stopColor="#141413" stopOpacity="0.88" />
        </linearGradient>
      </defs>
      {variant === 2 ? (
        /* Architectural Chelsea Boot / Runner */
        <>
          <path
            d="M24 34h34v24c14 14 34 18 54 22 10 2 12 10 12 16H18V52l6-18Z"
            fill={`url(#shoe-${uid})`}
            stroke={accentHex}
            strokeWidth="1.6"
          />
          <rect x="34" y="34" width="14" height="28" rx="2" strokeOpacity="0.6" />
          <path d="M16 96h110v8H16z" fill={accentHex} fillOpacity="0.22" stroke="#ECE9E2" />
        </>
      ) : variant === 3 ? (
        /* Low-Profile Court / Driving Loafer */
        <>
          <path
            d="M18 66c12-2 22-8 32-18l16 8c14 10 32 14 48 16 8 2 10 8 10 16H18V66Z"
            fill={`url(#shoe-${uid})`}
            stroke={accentHex}
            strokeWidth="1.6"
          />
          <path d="M46 56l18 14M54 52l18 14" stroke="#ECE9E2" strokeWidth="1.5" />
          <rect x="16" y="88" width="108" height="9" rx="3" stroke="#ECE9E2" />
        </>
      ) : variant === 4 ? (
        /* Sculpted Slingback / Evening Pump */
        <>
          <path
            d="M20 52c16 18 36 28 64 30l38 4c-4 8-18 10-40 10-28 0-46-14-62-30V52Z"
            fill={`url(#shoe-${uid})`}
            stroke={accentHex}
            strokeWidth="1.6"
          />
          <path d="M26 68v28h8l4-22" stroke="#ECE9E2" strokeWidth="1.8" />
          <path d="M16 96h108" strokeOpacity="0.4" />
        </>
      ) : (
        /* Hand-Welted Penny Loafer / Derby */
        <>
          <path
            d="M16 88V62q24-2 38-18l14 8q14 16 40 20 16 4 16 16H16Z"
            fill={`url(#shoe-${uid})`}
            stroke={accentHex}
            strokeWidth="1.6"
          />
          <path d="M52 54l18 10" stroke="#ECE9E2" strokeWidth="1.8" />
          <path d="M14 94h112" stroke="#ECE9E2" strokeWidth="2" />
          <rect x="16" y="88" width="26" height="6" fill={accentHex} fillOpacity="0.3" />
        </>
      )}
    </svg>
  )
}

