import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RocketShip from './RocketShip';
import { Compass, Sparkles, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cubic Bezier helper function:
 * Computes position (x, y) at parameter t in [0, 1]
 */
function getBezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

/**
 * Analytical Derivative of Cubic Bezier:
 * Returns the exact velocity tangent vector (dx, dy) and angle in degrees
 */
function getBezierTangent(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const dx =
    3 * u * u * (p1.x - p0.x) +
    6 * u * t * (p2.x - p1.x) +
    3 * t * t * (p3.x - p2.x);
  const dy =
    3 * u * u * (p1.y - p0.y) +
    6 * u * t * (p2.y - p1.y) +
    3 * t * t * (p3.y - p2.y);

  // Convert radians to degrees
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export default function RocketHeroScene({ onCompleteOpening }) {
  const containerRef = useRef(null);
  const rocketWrapRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const telemetryRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const [telemetry, setTelemetry] = useState({
    velocity: '0.00 km/s',
    trajectoryAngle: '0.0°',
    warpStatus: 'IDLE',
    progressPct: 0
  });

  const [thrustBoost, setThrustBoost] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const rocketWrap = rocketWrapRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const telemetryEl = telemetryRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!container || !rocketWrap || !title) return;

    // Responsive Bezier Control Points function
    // Unified 4-point Cubic Bezier gives 100% smooth C-infinity continuity
    const getControlPoints = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      return {
        p0: { x: -w * 0.08, y: h * 0.50 }, // Off-screen left entrance
        p1: { x: w * 0.28, y: h * 0.20 },  // Initial climb towards orbital speed
        p2: { x: w * 0.58, y: h * 0.80 },  // Graceful swooping dive through title
        p3: { x: w * 1.12, y: h * 0.14 }   // Hyperspace climb out of frame
      };
    };

    let pts = getControlPoints();

    // GSAP Timeline pinned to hero section
    // Scrub: 0.8 gives realistic momentum physics while remaining 100% reversible
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const velocity = Math.abs(self.getVelocity() || 0);

          // Update dynamic engine flame scaling based on scroll velocity
          const boost = Math.min(2.5, 1 + velocity / 1000);
          setThrustBoost(boost);

          // Telemetry HUD updates
          const speedKmS = (progress * 54.2 + (velocity / 150)).toFixed(1);
          setTelemetry({
            velocity: `${speedKmS} km/s`,
            warpStatus: progress > 0.82 ? 'WARP DRIVE CHARGED' : (progress > 0.1 ? 'SUBLIGHT BURN' : 'ORBITAL HOLD'),
            progressPct: Math.round(progress * 100)
          });

          // Callback to parent when opening reaches completion
          if (progress >= 0.96 && onCompleteOpening) {
            onCompleteOpening(true);
          }
        }
      }
    });

    // Custom GSAP object for animating parameter t smoothly
    const flightProgress = { t: 0 };

    tl.to(flightProgress, {
      t: 1,
      ease: 'none',
      duration: 3,
      onUpdate: () => {
        const t = flightProgress.t;
        const pos = getBezierPoint(pts.p0, pts.p1, pts.p2, pts.p3, t);
        const angle = getBezierTangent(pts.p0, pts.p1, pts.p2, pts.p3, t);

        // Apply 3D translate and true tangent rotation directly
        if (rocketWrap) {
          gsap.set(rocketWrap, {
            x: pos.x,
            y: pos.y,
            rotation: angle,
            force3D: true
          });
        }
      }
    }, 0);

    // Initial scroll prompt fade out as user starts scrolling
    tl.to(scrollIndicator, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: 'power1.out'
    }, 0.05);

    // Subtitle subtle fade and drift
    tl.to(subtitle, {
      opacity: 0.3,
      x: -40,
      duration: 0.8,
      ease: 'power1.inOut'
    }, 0.2);

    // Title behavior:
    // STAYS FULLY VISIBLE while the rocket dives through it (up to t = 0.70)
    // Only begins dissolving AFTER the rocket emerges past the letters!
    tl.to(title, {
      opacity: 1,
      duration: 1.8 // remains fully visible
    }, 0);

    tl.to(title, {
      opacity: 0,
      scale: 1.08,
      filter: 'blur(12px)',
      x: -60,
      duration: 0.9,
      ease: 'power2.in'
    }, 2.1); // fades out only toward the end of flight

    // Telemetry HUD fade out on exit
    tl.to(telemetryEl, {
      opacity: 0,
      duration: 0.4
    }, 2.5);

    // Handle responsive resize by recalculating points
    const handleResize = () => {
      pts = getControlPoints();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onCompleteOpening]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between bg-transparent"
      style={{
        // Transparent so Three.js JWST nebula and stars are fully visible
        backgroundColor: 'transparent'
      }}
    >
      {/* Flight Telemetry HUD (Desktop Top Header) */}
      <div 
        ref={telemetryRef}
        className="w-full px-8 pt-8 flex items-center justify-between z-20 pointer-events-none select-none transition-opacity duration-300"
      >
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-500/50" />
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-300/80">
            MISSION: ODYSSEY-1 • JWST NIRCam NGC 3324
          </span>
        </div>

        <div className="flex items-center space-x-8 font-mono text-xs text-slate-400">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Velocity</span>
            <span className="text-cyan-300 font-semibold">{telemetry.velocity}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Drive Mode</span>
            <span className="text-emerald-400 font-medium">{telemetry.warpStatus}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Orbit Sync</span>
            <span className="text-slate-200">{telemetry.progressPct}%</span>
          </div>
        </div>
      </div>

      {/* Hero Typography & Content */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center px-6 md:px-16 z-10 pointer-events-none select-none">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-end text-right">
          
          <p
            ref={subtitleRef}
            className="font-mono text-xs md:text-sm tracking-[0.35em] uppercase text-cyan-400/90 mb-3 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            Expedition to the Outer Cosmos
          </p>

          <h1
            ref={titleRef}
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight text-slate-100 leading-[1.02]"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: '0.04em',
              fontWeight: 900
            }}
          >
            EXPLORE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-100 to-blue-400 glow-text-cyan">
              THE ENDLESS
            </span>
          </h1>

          <p className="font-sans text-sm md:text-base text-slate-400 max-w-md mt-6 leading-relaxed font-light">
            Scroll down to engage sublight drives and initiate warp injection through anomalous space.
          </p>
        </div>
      </div>

      {/* Flying Spacecraft (Absolute Positioned and Managed by GSAP) */}
      <div
        ref={rocketWrapRef}
        className="absolute top-0 left-0 z-30 pointer-events-none will-change-transform"
        style={{
          transformOrigin: '55px 28px', // Center of rocket geometry
          transform: 'translate3d(-120px, 50vh, 0)'
        }}
      >
        <RocketShip thrustIntensity={thrustBoost} />
      </div>

      {/* Scroll Down Prompt Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="w-full pb-8 flex flex-col items-center justify-center z-20 pointer-events-none select-none text-slate-400"
      >
        <span className="font-mono text-[11px] tracking-[0.25em] uppercase mb-2 text-cyan-400/70">
          Scroll to Launch
        </span>
        <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce" />
      </div>
    </section>
  );
}
