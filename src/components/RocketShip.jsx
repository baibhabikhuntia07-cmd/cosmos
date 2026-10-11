import React from 'react';

/**
 * RocketShip - Cinematic vector spacecraft with dynamic plasma engine glow.
 * Built with genuine vector graphics so it scales cleanly across any resolution,
 * has a well-defined pivot point, and keeps the plasma trail firmly attached.
 */
export default function RocketShip({ thrustIntensity = 1, isBoosting = false }) {
  return (
    <div className="relative select-none pointer-events-none rocket-container">
      {/* Dynamic Engine Exhaust Trail Plume */}
      <div 
        className="absolute top-1/2 -left-28 -translate-y-1/2 pointer-events-none transition-transform duration-150"
        style={{
          transformOrigin: 'right center',
          transform: `scaleX(${0.8 + thrustIntensity * 0.5}) scaleY(${0.9 + thrustIntensity * 0.2})`
        }}
      >
        {/* Core hot exhaust */}
        <div 
          style={{
            width: '140px',
            height: '18px',
            background: 'linear-gradient(270deg, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.9) 35%, rgba(37,99,235,0.6) 75%, transparent 100%)',
            borderRadius: '50% 0 0 50%',
            filter: 'blur(3px)',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.9), 0 0 50px rgba(37, 99, 235, 0.7)'
          }}
        />
        {/* Secondary outer plasma halo */}
        <div 
          style={{
            position: 'absolute',
            top: '-6px',
            right: '0',
            width: '180px',
            height: '30px',
            background: 'linear-gradient(270deg, rgba(96,165,250,0.6) 0%, rgba(59,130,246,0.3) 60%, transparent 100%)',
            borderRadius: '50% 0 0 50%',
            filter: 'blur(10px)',
            opacity: 0.8
          }}
        />
        {/* Engine sparks / ionization rings */}
        <div 
          className="engine-rings"
          style={{
            position: 'absolute',
            top: '-2px',
            right: '20px',
            width: '60px',
            height: '22px',
            borderLeft: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            opacity: 0.7
          }}
        />
      </div>

      {/* Bespoke Spacecraft SVG (Designed pointing right at 0 deg for 1:1 path tangency) */}
      <svg
        width="110"
        height="56"
        viewBox="0 0 110 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rocket-svg"
        style={{
          filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.35))'
        }}
      >
        <defs>
          <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="canopyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <radialGradient id="thrusterGlow" cx="0%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
        </defs>

        {/* Thruster Bells */}
        <path d="M12 21 L2 18 L2 38 L12 35 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <ellipse cx="2" cy="28" rx="2.5" ry="10" fill="url(#thrusterGlow)" />

        {/* Top & Bottom Wing Fins */}
        <path d="M14 20 L26 4 L42 22 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
        <path d="M14 36 L26 52 L42 34 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />

        {/* Main Fuselage Body */}
        <path
          d="M12 22 C12 16, 40 16, 76 22 C92 25, 104 27, 108 28 C104 29, 92 31, 76 34 C40 40, 12 40, 12 34 Z"
          fill="url(#fuselageGrad)"
        />

        {/* Heat Shield Underside Stripe */}
        <path
          d="M16 32 C40 37, 72 34, 100 29 C92 31, 74 34, 16 34 Z"
          fill="#0f172a"
          opacity="0.8"
        />

        {/* Racing / Mission Stripe */}
        <path
          d="M30 25 L75 25 L73 28 L28 28 Z"
          fill="url(#accentGrad)"
        />

        {/* Cockpit Canopy */}
        <path
          d="M62 23 C68 20, 80 22, 85 27 C80 27, 68 26, 62 24 Z"
          fill="url(#canopyGrad)"
          stroke="#7dd3fc"
          strokeWidth="0.8"
        />

        {/* RCS Thrusters and Details */}
        <circle cx="88" cy="25" r="1" fill="#38bdf8" />
        <circle cx="48" cy="22" r="1.2" fill="#ef4444" />
        <circle cx="48" cy="34" r="1.2" fill="#22c55e" />

        {/* Subtle Panel Seam Lines */}
        <line x1="38" y1="21" x2="38" y2="35" stroke="#64748b" strokeWidth="0.8" opacity="0.6" />
        <line x1="58" y1="22" x2="58" y2="34" stroke="#64748b" strokeWidth="0.8" opacity="0.6" />
      </svg>
    </div>
  );
}
