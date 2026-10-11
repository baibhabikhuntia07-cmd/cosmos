import React, { useState } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navigation from './components/Navigation';
import RocketHeroScene from './components/RocketHeroScene';

export default function App() {
  const [openingFinished, setOpeningFinished] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#030611] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* 3D Cosmic Starfield Canvas */}
      <BackgroundCanvas />

      {/* Atmospheric Vignette Overlay */}
      <div className="cosmic-vignette" />

      {/* Top HUD Navigation */}
      <Navigation />

      {/* Main Scroll Experience */}
      <main className="relative z-10 w-full">
        {/* Scene 1: Opening Rocket Launch & Curved Title Dive */}
        <RocketHeroScene onCompleteOpening={setOpeningFinished} />

        {/* Scene 2 Bridge / Continuation Anchor */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center z-20">
          <div className="max-w-2xl mx-auto glass-panel p-8 md:p-12 border border-cyan-500/30">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400 mb-3 block">
              Phase 01 Achieved
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              ENTERING HYPERLUMINAL SPACE
            </h2>
            <p className="font-sans text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              The sublight drive has navigated the orbital plane. The wormhole anomaly event horizon is approaching ahead.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Next Scene: The Wormhole Conduit</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
