'use client';

import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Plus,
  Trash2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';
import { UserProgress, NicknamePreset } from '@/types/briefing';
import { addAccountabilityBuddy, removeAccountabilityBuddy, updateBuddyStatus } from '@/lib/storage';

interface AccountabilityBuddiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

const NICKNAME_PRESETS: NicknamePreset[] = [
  'Partner',
  'Wife',
  'Husband',
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Son',
  'Daughter',
  'Friend',
  'Work friend',
  'Neighbour',
  'Other',
];

export function AccountabilityBuddiesModal({
  isOpen,
  onClose,
  progress,
}: AccountabilityBuddiesModalProps) {
  const [targetPrepId, setTargetPrepId] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<NicknamePreset>('Friend');
  const [isLinking, setIsLinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddBuddy = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = targetPrepId.trim().toUpperCase().replace('-', ' ');
    if (!cleanId.startsWith('UDSS') || cleanId.length < 8) {
      setErrorMessage('Please enter a valid UDSS Prep ID (e.g. UDSS 3456).');
      return;
    }

    if (cleanId === progress.prepId) {
      setErrorMessage('You cannot link your own UDSS Prep ID as a buddy.');
      return;
    }

    setIsLinking(true);
    try {
      // Query server for headline readiness level
      const res = await fetch(`/api/status/${encodeURIComponent(cleanId)}`);
      let headlineLevel: 'Need to get going' | 'Partially prepared' | 'Fully prepared' = 'Partially prepared';

      if (res.ok) {
        const data = await res.json();
        if (data.headlineLevel) headlineLevel = data.headlineLevel;
      }

      addAccountabilityBuddy(cleanId, selectedPreset, headlineLevel);
      setTargetPrepId('');
      setIsLinking(false);
    } catch {
      // Fallback
      addAccountabilityBuddy(cleanId, selectedPreset, 'Partially prepared');
      setTargetPrepId('');
      setIsLinking(false);
    }
  };

  const handleRefreshBuddy = async (buddyId: string, prepId: string) => {
    try {
      const res = await fetch(`/api/status/${encodeURIComponent(prepId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.headlineLevel) {
          updateBuddyStatus(buddyId, data.headlineLevel);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleUnlink = (buddyId: string) => {
    removeAccountabilityBuddy(buddyId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="buddies-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1B2A4A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#8B1A1A]">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              Mutual Resilience Network
            </div>
            <h2 id="buddies-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              My linked people
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded"
            aria-label="Close My linked people dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A]">
          {/* Privacy & Anonymity Rule */}
          <div className="bg-[#FAF9F5] border-l-4 border-[#1B2A4A] p-4 text-xs leading-relaxed space-y-1.5">
            <div className="font-semibold text-[#1B2A4A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Strictly Anonymous Status Exchange
            </div>
            <p className="text-[#333333]">
              Linked people see <strong>only each other&apos;s headline preparedness level</strong> (e.g. &ldquo;Partially prepared&rdquo;), never your checklist items, household members, or medical details. Nicknames are stored solely on your device and are never transmitted.
            </p>
          </div>

          {/* Add Person Form */}
          <form onSubmit={handleAddBuddy} className="p-4 border border-[#D0D0D0] bg-[#FAF9F6] space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1B2A4A]">
              Link a New Person
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label htmlFor="target-prep-id" className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Person&apos;s UDSS Prep ID
                </label>
                <input
                  id="target-prep-id"
                  type="text"
                  placeholder="e.g. UDSS 8920"
                  required
                  value={targetPrepId}
                  onChange={(e) => setTargetPrepId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D0D0D0] bg-white font-mono uppercase focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="nickname-preset" className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Private Nickname (Preset)
                </label>
                <select
                  id="nickname-preset"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value as NicknamePreset)}
                  className="w-full px-3 py-2 text-sm border border-[#D0D0D0] bg-white focus:border-[#1B2A4A] focus:outline-none"
                >
                  {NICKNAME_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#666666] mt-0.5 block">
                  Multiple entries auto-enumerate: {selectedPreset} - 1, {selectedPreset} - 2
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLinking}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                {isLinking ? 'Verifying...' : 'Link Person'}
              </button>
            </div>
          </form>

          {/* Linked People List */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1B2A4A] border-b border-[#D0D0D0] pb-2 flex items-center justify-between">
              <span>My linked people ({progress.buddies.length})</span>
              <span className="text-xs font-sans font-normal text-[#666666]">
                Your Prep ID: <strong className="font-mono text-[#1B2A4A]">{progress.prepId}</strong>
              </span>
            </h3>

            {progress.buddies.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF9F5] border border-[#D0D0D0] text-xs text-[#666666] space-y-2">
                <UserCheck className="w-8 h-8 text-[#A0A0A0] mx-auto" />
                <p>No linked people added yet.</p>
                <p className="max-w-md mx-auto text-[#4A4A4A]">
                  Share your Prep ID (<strong className="font-mono">{progress.prepId}</strong>) with a family member, work colleague, or neighbour so you can track each other&apos;s readiness anonymously.
                </p>
                <div className="pt-2 text-[11px] text-[#4A4A4A]">
                  Try testing with demo peer: <button type="button" onClick={() => setTargetPrepId('UDSS 8920')} className="font-mono font-bold text-[#1B2A4A] underline">UDSS 8920</button> or <button type="button" onClick={() => setTargetPrepId('UDSS 1142')} className="font-mono font-bold text-[#1B2A4A] underline">UDSS 1142</button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#D0D0D0] border border-[#D0D0D0] bg-white">
                {progress.buddies.map((buddy) => {
                  let badge = 'bg-amber-50 text-amber-950 border-amber-300';
                  if (buddy.headlineLevel === 'Fully prepared') {
                    badge = 'bg-emerald-50 text-emerald-950 border-emerald-300';
                  } else if (buddy.headlineLevel === 'Need to get going') {
                    badge = 'bg-rose-50 text-rose-950 border-rose-300';
                  }

                  return (
                    <div
                      key={buddy.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#1B2A4A]">
                            {buddy.prepId}
                          </span>
                          <span className="font-mono text-[11px] text-[#666666] bg-[#EAEAE2] px-2 py-0.5 border border-[#D0D0D0]">
                            {buddy.nicknamePreset} - {buddy.nicknameIndex}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#666666]">
                          Last synchronized: {new Date(buddy.lastSynced).toLocaleDateString('en-GB')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${badge}`}>
                          {buddy.headlineLevel}
                        </span>

                        <button
                          onClick={() => handleRefreshBuddy(buddy.id, buddy.prepId)}
                          className="p-1.5 text-[#4A4A4A] hover:text-[#1B2A4A] border border-[#D0D0D0] hover:bg-[#F5F5F0]"
                          title="Refresh status"
                          aria-label={`Refresh ${buddy.prepId} status`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleUnlink(buddy.id)}
                          className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors inline-flex items-center gap-1"
                          title="Unlink immediately"
                        >
                          <Trash2 className="w-3 h-3" />
                          Unlink
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F5F0] border-t border-[#D0D0D0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
