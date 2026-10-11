import React, { useState } from 'react';
import { Volume2, VolumeX, Compass, Radio } from 'lucide-react';

export default function Navigation() {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  // Web Audio API ambient cosmic deep drone generator
  const toggleCosmicAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();

        // Deep cosmic bass drone oscillator
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note 55Hz

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 note 110Hz

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setAudioContext({ ctx, osc1, osc2, gain });
        setIsAudioActive(true);
      } catch (e) {
        console.warn('Audio not supported or blocked:', e);
      }
    } else {
      if (audioContext) {
        audioContext.gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.ctx.currentTime + 0.5);
        setTimeout(() => {
          audioContext.osc1.stop();
          audioContext.osc2.stop();
          audioContext.ctx.close();
        }, 500);
      }
      setIsAudioActive(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 pointer-events-none px-6 py-5 flex items-center justify-between">
      {/* Brand Title */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <div className="w-8 h-8 rounded-full border border-cyan-400/40 flex items-center justify-center bg-sky-950/40 backdrop-blur-md">
          <Compass className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <span className="font-display font-black tracking-widest text-lg text-slate-100 uppercase">
            COSMOS
          </span>
          <span className="hidden md:inline-block ml-3 font-mono text-[10px] tracking-widest uppercase text-cyan-400/70 border-l border-slate-700 pl-3">
            Exploration Terminal
          </span>
        </div>
      </div>

      {/* Audio Ambient Synth Toggle & Status */}
      <div className="flex items-center space-x-4 pointer-events-auto">
        <button
          onClick={toggleCosmicAudio}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md transition-all text-xs font-mono text-cyan-300"
          title="Toggle Ambient Space Drone"
        >
          {isAudioActive ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider">Sound: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Sound: OFF</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
