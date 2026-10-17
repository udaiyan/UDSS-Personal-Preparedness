'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, FileText, ChevronDown, ChevronUp, ArrowRight, Shield } from 'lucide-react';

interface SirRichardVideoIntroProps {
  onStartBasicPreparedness: () => void;
}

export function SirRichardVideoIntro({ onStartBasicPreparedness }: SirRichardVideoIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <section className="bg-white border-2 border-[#1B2A4A] shadow-sm overflow-hidden">
      <div className="bg-[#1B2A4A] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b-2 border-[#8B1A1A]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#8B1A1A]" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-200">
            Strategic Resilience Address
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-300">
          Duration: 2 min briefing
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Video Stage Container */}
        <div className="lg:col-span-7 bg-[#0E1726] relative aspect-video flex items-center justify-center overflow-hidden group">
          {/* Official Backdrop / Still */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

          {/* Simulated Official Video Feed Background */}
          <div className="absolute inset-0 bg-[#131f33] flex items-center justify-center">
            <div className="text-center p-6 space-y-2 select-none">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#1B2A4A] border-2 border-[#3A4D78] flex items-center justify-center text-white shadow-xl">
                <Shield className="w-10 h-10 text-slate-200" />
              </div>
              <div className="text-white font-serif font-bold text-lg sm:text-xl tracking-tight">
                General Sir Richard Barrons KCB CBE
              </div>
              <div className="text-slate-300 text-xs font-mono uppercase tracking-wider">
                Co-Chairman, Universal Defence &amp; Security Solutions
              </div>
              <div className="text-slate-400 text-[11px] italic">
                Former Commander, UK Joint Forces Command
              </div>
            </div>
          </div>

          {/* Active play status overlay */}
          {isPlaying && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 px-2.5 py-1 text-[11px] text-white font-mono border border-white/20">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              PLAYING • RECORDED AT 33 CANNON ST, LONDON
            </div>
          )}

          {/* Video Control Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 rounded-full bg-[#8B1A1A] hover:bg-[#6e1414] text-white shadow-2xl transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/40"
              aria-label={isPlaying ? 'Pause video address' : 'Play video address'}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-0.5" />}
            </button>
          </div>

          {/* Bottom Video Controls */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-slate-200 font-mono text-[11px]"
              >
                {isPlaying ? 'Pause' : 'Play Briefing'}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:text-slate-200"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-black/40 px-2 py-0.5 border border-white/20"
            >
              <FileText className="w-3 h-3" />
              {showTranscript ? 'Hide Transcript' : 'Read Transcript'}
            </button>
          </div>
        </div>

        {/* Video Context & Call-to-Action Sidebar */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4 bg-[#FAF9F5]">
          <div className="space-y-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#8B1A1A] font-bold">
              Commander&apos;s Foreword
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A] leading-tight">
              &ldquo;National Deterrence Begins on the British Household Doorstep.&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-[#333333] leading-relaxed">
              In this introductory address, General Sir Richard Barrons explains why modern hybrid threats deliberately target civilian infrastructure below the threshold of war, and why simple, proportionate household preparedness neutralises hostile leverage before panic can take root.
            </p>
          </div>

          <div className="pt-2 border-t border-[#D0D0D0] space-y-3">
            <div className="text-xs text-[#4A4A4A] space-y-1">
              <div className="font-semibold text-[#1B2A4A]">Core Command Objective:</div>
              <p>Achieve at least 100% on the Basic Preparedness tier before considering advanced self-sufficiency measures.</p>
            </div>

            <button
              onClick={onStartBasicPreparedness}
              className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors inline-flex items-center justify-center gap-2"
            >
              Begin Basic Preparedness Checklist
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Official Transcript */}
      {showTranscript && (
        <div className="p-6 bg-white border-t border-[#D0D0D0] text-xs sm:text-sm text-[#222222] leading-relaxed space-y-3 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-[#D0D0D0]">
            <strong className="font-serif text-base text-[#1B2A4A]">
              Official Transcript: General Sir Richard Barrons KCB CBE
            </strong>
            <button
              onClick={() => setShowTranscript(false)}
              className="text-xs text-[#666666] hover:text-[#1A1A1A]"
            >
              Close Transcript
            </button>
          </div>
          <p className="italic text-[#4A4A4A]">
            &ldquo;Good day. I am Richard Barrons, Co-Chairman of Universal Defence and Security Solutions.
          </p>
          <p>
            For many decades, British citizens could comfortably assume that major strategic crises would be handled strictly by our armed forces, our police, and our emergency services far from our homes.
          </p>
          <p>
            That era of strategic isolation is over. We now exist in an interconnected world where state adversaries, cyber cartels, and extreme meteorological events target our critical national infrastructure—our electricity grids, our subsea fiber cables, our digital payment switches, and our just-in-time food logistics.
          </p>
          <p>
            When an adversary contemplates coercion against the United Kingdom, they examine our society&apos;s fragility. If a forty-eight-hour power outage or payment terminal failure induces widespread panic, empty shelves, and social distress, our national decision-makers are placed under acute leverage.
          </p>
          <p>
            Conversely, when millions of British households calmly maintain three days of water, basic ambient food, emergency lighting, an analogue radio, and an agreed communications plan, the utility of hostile grey-zone coercion collapses entirely.
          </p>
          <p className="font-semibold text-[#1B2A4A]">
            Preparedness is not about retreating into fear, building bunkers, or adopting an American survivalist mindset. It is about quiet, practical British common sense. Complete the basic checklist today. You protect your family, you spare our emergency services, and you strengthen the fabric of our country. Thank you.&rdquo;
          </p>
        </div>
      )}
    </section>
  );
}
