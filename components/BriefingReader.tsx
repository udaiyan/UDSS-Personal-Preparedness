'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Printer,
  Shield,
  Check,
  Download
} from 'lucide-react';
import { Briefing, UserProgress } from '@/types/briefing';
import { saveQuestionAnswerStorage, markBriefingAsReadStorage } from '@/lib/storage';
import { safePrintOrDownload, downloadTextFile } from '@/lib/safe-print';

interface BriefingReaderProps {
  briefing: Briefing;
  allBriefings: Briefing[];
  progress: UserProgress;
  onProgressUpdate?: (updated: UserProgress) => void;
  onBack: () => void;
  onSelectBriefing: (briefing: Briefing) => void;
}

export function BriefingReader({
  briefing,
  allBriefings,
  progress,
  onProgressUpdate,
  onBack,
  onSelectBriefing,
}: BriefingReaderProps) {
  const existingAnswer = progress.answeredQuestions[briefing.question.id];

  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [hasSubmittedLocally, setHasSubmittedLocally] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedOption =
    userSelectedOption !== null
      ? userSelectedOption
      : existingAnswer !== undefined
      ? existingAnswer.selectedIndex
      : null;
  const hasSubmitted = hasSubmittedLocally || existingAnswer !== undefined;

  useEffect(() => {
    // Mark briefing as read in store
    markBriefingAsReadStorage(briefing.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [briefing.id]);

  const handleSelectOption = (index: number) => {
    if (hasSubmitted) return;
    setUserSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === briefing.question.correctIndex;
    setHasSubmittedLocally(true);
    const updated = saveQuestionAnswerStorage(briefing.question.id, selectedOption, isCorrect);
    onProgressUpdate?.(updated);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${briefing.title} - UDSS Resilience Brief`,
      text: briefing.summary,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed share dialog
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getBriefingText = () => {
    const lines = [
      '=============================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'NATIONAL RESILIENCE BRIEFING',
      '33 Cannon St, London EC4M 5SB',
      '=============================================================',
      `Title: ${briefing.title}`,
      `Month: ${briefing.month} | Category: ${briefing.category}`,
      `Read Time: ${briefing.readTime}`,
      `Threat Assessment: ${briefing.threatLevel}`,
      '',
      'EXECUTIVE SUMMARY:',
      briefing.summary,
      '',
      'INTRODUCTION:',
      briefing.introduction,
      '',
      `--- ${briefing.section1.heading.toUpperCase()} ---`,
      ...briefing.section1.paragraphs,
      '',
      `--- ${briefing.section2.heading.toUpperCase()} ---`,
      ...briefing.section2.paragraphs,
      '',
      `--- ${briefing.section3.heading.toUpperCase()} ---`,
      ...briefing.section3.items.map((item, idx) => `${idx + 1}. ${item}`),
      '',
      `--- ${briefing.conclusion.heading.toUpperCase()} ---`,
      ...briefing.conclusion.paragraphs,
      '',
      '=============================================================',
    ];

    return lines.join('\n');
  };

  const handlePrintBriefing = () => {
    safePrintOrDownload(`UDSS-Briefing-${briefing.slug}.txt`, getBriefingText);
  };

  const handleDownloadBriefing = () => {
    downloadTextFile(`UDSS-Briefing-${briefing.slug}.txt`, getBriefingText());
  };

  const currentIndex = allBriefings.findIndex((b) => b.id === briefing.id);
  const nextBriefing = currentIndex > 0 ? allBriefings[currentIndex - 1] : null;
  const prevBriefing = currentIndex < allBriefings.length - 1 ? allBriefings[currentIndex + 1] : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Top back & actions bar */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#D0D0D0]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] hover:text-[#0E1726] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Briefings Index
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white border border-[#D0D0D0] hover:bg-[#EAEAE2] rounded transition-colors"
            title="Share this briefing"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                Copied Link
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Share
              </>
            )}
          </button>

          <button
            onClick={handlePrintBriefing}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-white border border-[#D0D0D0] hover:bg-[#EAEAE2] rounded transition-colors"
            title="Print or export this briefing"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          <button
            onClick={handleDownloadBriefing}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-white border border-[#D0D0D0] hover:bg-[#EAEAE2] rounded transition-colors"
            title="Download briefing as text document"
          >
            <Download className="w-3.5 h-3.5" />
            Download (.txt)
          </button>
        </div>
      </div>

      {/* Official Document Header */}
      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4A4A4A]">
          <span className="px-2 py-0.5 bg-[#1B2A4A] text-white font-semibold">
            {briefing.category}
          </span>
          <span className="flex items-center gap-1 text-[#4A4A4A]">
            <Calendar className="w-3.5 h-3.5" />
            {briefing.month}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#4A4A4A]">
            <Clock className="w-3.5 h-3.5" />
            {briefing.readTime}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#8B1A1A] font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Threat Assessment: {briefing.threatLevel}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2A4A] leading-tight">
          {briefing.title}
        </h1>

        <div className="border-l-4 border-[#8B1A1A] pl-4 py-1 text-base sm:text-lg text-[#333333] font-serif italic bg-[#EFEFEA]/50">
          {briefing.introduction}
        </div>
      </header>

      {/* Main Body Content with strict British institutional styling */}
      <div className="mt-8 space-y-8 text-[#1A1A1A] leading-relaxed max-w-[75ch]">
        {/* Section 1: What is happening */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A] border-b border-[#D0D0D0] pb-2">
            {briefing.section1.heading}
          </h2>
          <div className="space-y-3.5 text-base sm:text-[17px] text-[#222222]">
            {briefing.section1.paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Section 2: Why it matters */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A] border-b border-[#D0D0D0] pb-2">
            {briefing.section2.heading}
          </h2>
          <div className="space-y-3.5 text-base sm:text-[17px] text-[#222222]">
            {briefing.section2.paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Section 3: What you can do */}
        <section className="space-y-4 bg-white border border-[#D0D0D0] p-6 shadow-xs">
          <div className="flex items-center gap-2 text-[#1B2A4A]">
            <Shield className="w-5 h-5 text-[#8B1A1A]" />
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
              {briefing.section3.heading}
            </h2>
          </div>
          <p className="text-xs text-[#4A4A4A] uppercase tracking-wider font-mono">
            Actionable and proportionate household measures
          </p>
          <ul className="space-y-3 pt-2 text-base text-[#222222]">
            {briefing.section3.items.map((item, idx) => {
              const colonIndex = item.indexOf(':');
              const title = colonIndex !== -1 ? item.substring(0, colonIndex) : null;
              const detail = colonIndex !== -1 ? item.substring(colonIndex + 1) : item;

              return (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-[11px] font-bold text-white mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    {title && (
                      <strong className="font-semibold text-[#1B2A4A] block mb-0.5">
                        {title}
                      </strong>
                    )}
                    <span className="text-[#333333] leading-relaxed">{detail}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Conclusion: Strategic Assessment */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A] border-b border-[#D0D0D0] pb-2">
            {briefing.conclusion.heading}
          </h2>
          <div className="space-y-3.5 text-base sm:text-[17px] text-[#222222]">
            {briefing.conclusion.paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>
      </div>

      {/* Multiple-Choice Knowledge Check Section */}
      <section className="mt-12 bg-[#F9F9F6] border-2 border-[#1B2A4A] p-6 sm:p-8">
        <div className="flex items-center gap-2 text-[#1B2A4A] pb-3 border-b border-[#D0D0D0]">
          <HelpCircle className="w-5 h-5 text-[#8B1A1A]" />
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B2A4A]">
            Knowledge Check: {briefing.month}
          </h3>
        </div>

        <p className="mt-3 text-sm text-[#4A4A4A]">
          Test your comprehension of this month&apos;s strategic briefing. Select the single most accurate response.
        </p>

        <div className="mt-4 font-serif text-base sm:text-lg font-semibold text-[#1A1A1A]">
          {briefing.question.prompt}
        </div>

        {/* Options */}
        <div className="mt-4 space-y-2.5">
          {briefing.question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            let optionStyles = 'border-[#D0D0D0] bg-white hover:bg-[#F5F5F0] text-[#1A1A1A]';

            if (selectedOption === idx && !hasSubmitted) {
              optionStyles = 'border-[#1B2A4A] bg-[#1B2A4A]/5 ring-2 ring-[#1B2A4A]';
            }

            if (hasSubmitted) {
              if (idx === briefing.question.correctIndex) {
                optionStyles = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
              } else if (selectedOption === idx && idx !== briefing.question.correctIndex) {
                optionStyles = 'border-rose-600 bg-rose-50 text-rose-950';
              } else {
                optionStyles = 'border-[#D0D0D0] bg-white opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={hasSubmitted}
                className={`w-full text-left p-3.5 border transition-all flex items-start gap-3 rounded-none ${optionStyles}`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center font-mono text-xs font-bold border ${
                  selectedOption === idx ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-[#EFEFEA] text-[#1A1A1A] border-[#D0D0D0]'
                }`}>
                  {letter}
                </span>
                <span className="text-sm sm:text-base leading-snug pt-0.5">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submit or Result state */}
        {!hasSubmitted ? (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Verify Response
            </button>
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-none border border-[#D0D0D0] bg-white">
            <div className="flex items-center gap-2 mb-2">
              {selectedOption === briefing.question.correctIndex ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <span className="font-serif font-bold text-emerald-800 text-base">
                    Correct Assessment
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-[#8B1A1A]" />
                  <span className="font-serif font-bold text-[#8B1A1A] text-base">
                    Incorrect. Correct Answer: Option {String.fromCharCode(65 + briefing.question.correctIndex)}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-[#333333] leading-relaxed">
              <strong className="font-semibold text-[#1A1A1A]">Official Rationale: </strong>
              {briefing.question.explanation}
            </p>
          </div>
        )}
      </section>

      {/* Statutory Disclaimer requirement */}
      <div className="mt-8 p-4 bg-[#EAEAE5] border border-[#D0D0D0] text-xs text-[#4A4A4A] leading-relaxed">
        <strong className="font-semibold text-[#1A1A1A]">Official Disclaimer: </strong>
        This app provides general information and guidance on personal preparedness. It is not a substitute for official government advice. In an emergency, always follow instructions from the police, local authorities, and the UK government.
      </div>

      {/* Navigation Footer for next / prev briefing */}
      <div className="mt-8 pt-6 border-t border-[#D0D0D0] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevBriefing ? (
          <button
            onClick={() => onSelectBriefing(prevBriefing)}
            className="w-full sm:w-auto text-left text-xs font-semibold text-[#1B2A4A] hover:underline"
          >
            &larr; Previous Briefing: {prevBriefing.title} ({prevBriefing.month})
          </button>
        ) : (
          <div />
        )}

        {nextBriefing && (
          <button
            onClick={() => onSelectBriefing(nextBriefing)}
            className="w-full sm:w-auto text-right text-xs font-semibold text-[#1B2A4A] hover:underline"
          >
            Next Briefing: {nextBriefing.title} ({nextBriefing.month}) &rarr;
          </button>
        )}
      </div>
    </article>
  );
}
