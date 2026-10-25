'use client';

import { useSyncExternalStore } from 'react';
import {
  UserProgress,
  HouseholdProfile,
  ChecklistItemStatus,
  NicknamePreset,
  AccountabilityBuddy,
  EmergencyPlan,
  UtilityShutoffPlan,
  ChecklistItem,
  ReadinessLevel,
  IndividualGrabBag,
  GrabBagItem,
} from '@/types/briefing';
import { encryptPayload, decryptPayload } from '@/lib/crypto';
import rawChecklist from '@/data/checklist.json';

const STORAGE_KEY = 'udss_personal_preparedness_v2';

function generateRandomToken(): string {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'rec_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generatePrepId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `UDSS ${num}`;
}

export function generateDefaultGrabBagItems(role: 'adult' | 'child' | 'infant' | 'senior' | 'pet'): GrabBagItem[] {
  const common: GrabBagItem[] = [
    { id: 'water', label: '0.5L drinking water & non-perishable snack bar', isPacked: false },
    { id: 'light', label: 'Compact LED torch or headlamp with spare batteries', isPacked: false },
    { id: 'power', label: 'Pre-charged portable power bank & phone charging cable', isPacked: false },
    { id: 'warmth', label: 'Foil emergency space blanket, wool socks & waterproof layer', isPacked: false },
    { id: 'docs', label: 'Laminated emergency contact card & identity photocopy', isPacked: false },
  ];

  if (role === 'child') {
    return [
      ...common,
      { id: 'comfort', label: 'Comfort item (small toy, book, or familiar memento)', isPacked: false },
      { id: 'whistle', label: 'Safety whistle with safety neck lanyard', isPacked: false },
    ];
  }

  if (role === 'infant') {
    return [
      { id: 'formula', label: '48-hour ready-to-feed baby formula & clean bottles', isPacked: false },
      { id: 'nappies', label: 'Nappies, wet wipes & nappy disposal bags', isPacked: false },
      { id: 'clothes', label: 'Two full changes of warm infant clothing & baby blanket', isPacked: false },
      { id: 'soother', label: 'Sterilised soothers / teething essentials', isPacked: false },
      { id: 'meds', label: 'Infant paracetamol (Calpol) & dosage syringe', isPacked: false },
    ];
  }

  if (role === 'senior') {
    return [
      ...common,
      { id: 'meds', label: '7-day labelled pillbox of vital daily prescription medicine', isPacked: false },
      { id: 'glasses', label: 'Spare reading glasses & hearing aid spare batteries', isPacked: false },
      { id: 'mobility', label: 'Mobility support (collapsible cane, orthopaedic support)', isPacked: false },
    ];
  }

  if (role === 'pet') {
    return [
      { id: 'pet-food', label: '3-day tinned or dry pet food with portable bowl', isPacked: false },
      { id: 'pet-water', label: '1.5L bottled water for pet hydration', isPacked: false },
      { id: 'lead', label: 'Sturdy lead, harness, collar with ID tag, and pet carrier', isPacked: false },
      { id: 'records', label: 'Vaccination record & veterinary chip number photocopy', isPacked: false },
    ];
  }

  // Adult
  return [
    ...common,
    { id: 'meds', label: 'Essential personal prescription medications (7-day buffer)', isPacked: false },
    { id: 'cash', label: '£40 in low-denomination banknotes (£5, £10 notes)', isPacked: false },
    { id: 'firstaid', label: 'Compact personal first aid kit (antiseptic, dressings, analgesics)', isPacked: false },
    { id: 'mask', label: 'FFP2/FFP3 particulate respirator mask & work gloves', isPacked: false },
  ];
}

export function syncGrabBagsWithMembers(
  profile: HouseholdProfile,
  existingBags: Record<string, IndividualGrabBag>
): Record<string, IndividualGrabBag> {
  const result: Record<string, IndividualGrabBag> = {};

  profile.members.forEach((member) => {
    if (existingBags[member.id]) {
      result[member.id] = {
        ...existingBags[member.id],
        label: member.label,
        role: member.category,
      };
    } else {
      result[member.id] = {
        memberId: member.id,
        label: member.label,
        role: member.category,
        items: generateDefaultGrabBagItems(member.category),
        isComplete: false,
      };
    }
  });

  if (profile.hasPets && profile.petCount > 0) {
    const petId = 'member-pet';
    if (existingBags[petId]) {
      result[petId] = existingBags[petId];
    } else {
      result[petId] = {
        memberId: petId,
        label: profile.petCount === 1 ? 'Family Pet' : `Family Pets (${profile.petCount})`,
        role: 'pet',
        items: generateDefaultGrabBagItems('pet'),
        isComplete: false,
      };
    }
  }

  return result;
}

export const defaultProgress: UserProgress = {
  prepId: 'UDSS 3456',
  recoveryToken: '00000000-0000-4000-8000-000000000000',
  cloudBackupEnabled: false,
  lastBackupTime: null,
  householdProfile: {
    members: [
      { id: 'm-1', category: 'adult', label: 'Adult 1', specialNeeds: {} },
      { id: 'm-2', category: 'adult', label: 'Adult 2', specialNeeds: {} },
      { id: 'm-3', category: 'child', label: 'Child 1', specialNeeds: {} },
    ],
    hasPets: false,
    petCount: 0,
    hasCompletedOnboarding: false,
  },
  checklistStatuses: {},
  completedChecklistIds: [],
  individualGrabBags: {},
  buddies: [],
  emergencyPlan: {
    primaryContactName: '',
    primaryContactPhone: '',
    outOfAreaContactName: '',
    outOfAreaContactPhone: '',
    primaryMeetingPoint: 'Home front doorstep',
    secondaryMeetingPoint: 'Local parish hall or library',
    meetingTriggerTime: 'Within 2 hours of regional grid or network collapse',
    offlineCommsProtocol: 'Prioritise SMS text to out-of-area contact; listen to BBC Radio 4 at top of the hour',
    gpSurgery: '',
    localPharmacy: '',
    essentialPrescriptions: '',
  },
  utilityPlan: {
    waterStopcockLocation: 'Under kitchen sink (brass turncock valve)',
    electricityConsumerUnitLocation: 'Hallway storage cupboard (top shelf left)',
    gasMeterValveLocation: 'External white meter box on front exterior wall (quarter-turn lever)',
    specialHazardsNotes: '',
  },
  answeredQuestions: {},
  readBriefingIds: [],
  pantryChecklist: {},
};

// Populate initial grab bags for default members
defaultProgress.individualGrabBags = syncGrabBagsWithMembers(
  defaultProgress.householdProfile,
  {}
);

let cachedProgress: UserProgress | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First-time visit: generate real cryptographically random values
      const initial: UserProgress = {
        ...defaultProgress,
        prepId: generatePrepId(),
        recoveryToken: generateRandomToken(),
        checklistStatuses: {},
        individualGrabBags: syncGrabBagsWithMembers(defaultProgress.householdProfile, {}),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as UserProgress;
    // Backwards-compatibility merges
    if (!parsed.prepId) parsed.prepId = generatePrepId();
    if (!parsed.recoveryToken) parsed.recoveryToken = generateRandomToken();
    if (!parsed.householdProfile) parsed.householdProfile = defaultProgress.householdProfile;
    if (!parsed.checklistStatuses) {
      parsed.checklistStatuses = {};
      (parsed.completedChecklistIds || []).forEach((id) => {
        parsed.checklistStatuses[id] = 'completed';
      });
    }
    if (!parsed.individualGrabBags || Object.keys(parsed.individualGrabBags).length === 0) {
      parsed.individualGrabBags = syncGrabBagsWithMembers(parsed.householdProfile, {});
    }
    if (!parsed.emergencyPlan) parsed.emergencyPlan = defaultProgress.emergencyPlan;
    if (!parsed.utilityPlan) parsed.utilityPlan = defaultProgress.utilityPlan;
    if (!parsed.buddies) parsed.buddies = [];
    if (!parsed.pantryChecklist) parsed.pantryChecklist = {};
    return parsed;
  } catch (e) {
    console.error('Failed to read user progress from localStorage', e);
    return defaultProgress;
  }
}

export function saveStoredProgress(progress: UserProgress): void {
  cachedProgress = progress;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save user progress to localStorage', e);
    }
  }
  emitChange();
}

function subscribeToProgress(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedProgress = null;
      callback();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

function getProgressSnapshot(): UserProgress {
  if (cachedProgress === null) {
    cachedProgress = getStoredProgress();
  }
  return cachedProgress;
}

function getProgressServerSnapshot(): UserProgress {
  return defaultProgress;
}

export function useUserProgress(): UserProgress {
  return useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getProgressServerSnapshot
  );
}

// Calculations for Household Ready Score
export function calculateHouseholdReadyScore(
  progress: UserProgress,
  items: ChecklistItem[]
): {
  percentage: number;
  level: ReadinessLevel;
  completedCount: number;
  relevantTotal: number;
  inProgressCount: number;
  actionRequired: string;
  advancedCompletedCount: number;
  advancedTotal: number;
} {
  const basicItems = items.filter((i) => i.tier === 'basic');
  const advancedItems = items.filter((i) => i.tier === 'advanced');

  let relevantBasicTotal = 0;
  let earnedScore = 0;
  let completedCount = 0;
  let inProgressCount = 0;

  basicItems.forEach((item) => {
    const status = progress.checklistStatuses[item.id] || 'not_addressed';
    if (status === 'not_relevant') {
      return; // Not penalised
    }
    relevantBasicTotal++;
    if (status === 'completed') {
      earnedScore += 1;
      completedCount++;
    } else if (status === 'in_progress') {
      earnedScore += 0.5;
      inProgressCount++;
    }
  });

  // Also include grab bags in the basic readiness calculation
  const grabBags = Object.values(progress.individualGrabBags || {});
  if (grabBags.length > 0) {
    relevantBasicTotal += 1; // 1 aggregate unit for full household grab bags
    const packedCount = grabBags.filter((b) => b.isComplete).length;
    if (packedCount === grabBags.length) {
      earnedScore += 1;
      completedCount++;
    } else if (packedCount > 0) {
      earnedScore += 0.5;
      inProgressCount++;
    }
  }

  const percentage = relevantBasicTotal > 0 ? Math.round((earnedScore / relevantBasicTotal) * 100) : 0;

  let level: ReadinessLevel = 'Need to get going';
  let actionRequired = 'Store 72 hours of water and secure LED lighting to establish baseline resilience.';

  if (percentage >= 80) {
    level = 'Fully prepared';
    actionRequired = 'Core household standards met. Consider exploring advanced self-sufficiency measures.';
  } else if (percentage >= 40) {
    level = 'Partially prepared';
    actionRequired = 'Foundation in place. Complete your 14-day medication buffer and family meeting plan to reach Fully Prepared.';
  }

  // Advanced tier calculation
  let advancedCompletedCount = 0;
  advancedItems.forEach((item) => {
    const status = progress.checklistStatuses[item.id];
    if (status === 'completed') advancedCompletedCount++;
  });

  return {
    percentage,
    level,
    completedCount,
    relevantTotal: relevantBasicTotal,
    inProgressCount,
    actionRequired,
    advancedCompletedCount,
    advancedTotal: advancedItems.length,
  };
}

// Mutators
export function updateChecklistItemStatus(itemId: string, status: ChecklistItemStatus): UserProgress {
  const current = getProgressSnapshot();
  const updatedStatuses = {
    ...current.checklistStatuses,
    [itemId]: status,
  };
  const updatedCompletedIds = Object.keys(updatedStatuses).filter(
    (id) => updatedStatuses[id] === 'completed'
  );

  const updated: UserProgress = {
    ...current,
    checklistStatuses: updatedStatuses,
    completedChecklistIds: updatedCompletedIds,
  };
  saveStoredProgress(updated);
  return updated;
}

export function updateHouseholdProfile(profile: HouseholdProfile): UserProgress {
  const current = getProgressSnapshot();
  const updatedGrabBags = syncGrabBagsWithMembers(profile, current.individualGrabBags);

  const updated: UserProgress = {
    ...current,
    householdProfile: profile,
    individualGrabBags: updatedGrabBags,
  };
  saveStoredProgress(updated);
  return updated;
}

export function toggleGrabBagItem(memberId: string, itemId: string): UserProgress {
  const current = getProgressSnapshot();
  const bag = current.individualGrabBags[memberId];
  if (!bag) return current;

  const updatedItems = bag.items.map((item) =>
    item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
  );
  const isComplete = updatedItems.every((i) => i.isPacked);

  const updated: UserProgress = {
    ...current,
    individualGrabBags: {
      ...current.individualGrabBags,
      [memberId]: {
        ...bag,
        items: updatedItems,
        isComplete,
      },
    },
  };
  saveStoredProgress(updated);
  return updated;
}

export function markEntireGrabBag(memberId: string, complete: boolean): UserProgress {
  const current = getProgressSnapshot();
  const bag = current.individualGrabBags[memberId];
  if (!bag) return current;

  const updatedItems = bag.items.map((item) => ({ ...item, isPacked: complete }));

  const updated: UserProgress = {
    ...current,
    individualGrabBags: {
      ...current.individualGrabBags,
      [memberId]: {
        ...bag,
        items: updatedItems,
        isComplete: complete,
      },
    },
  };
  saveStoredProgress(updated);
  return updated;
}

export function addAccountabilityBuddy(
  prepId: string,
  nicknamePreset: NicknamePreset,
  headlineLevel: 'Need to get going' | 'Partially prepared' | 'Fully prepared' = 'Partially prepared'
): UserProgress {
  const current = getProgressSnapshot();
  const existingSameNicknames = current.buddies.filter((b) => b.nicknamePreset === nicknamePreset);
  const nextIndex = existingSameNicknames.length + 1;

  const newBuddy: AccountabilityBuddy = {
    id: 'buddy_' + Date.now().toString(36),
    prepId: prepId.trim().toUpperCase(),
    nicknamePreset,
    nicknameIndex: nextIndex,
    headlineLevel,
    lastSynced: new Date().toISOString(),
  };

  const updated: UserProgress = {
    ...current,
    buddies: [...current.buddies.filter((b) => b.prepId !== newBuddy.prepId), newBuddy],
  };
  saveStoredProgress(updated);
  return updated;
}

export function updateBuddyStatus(buddyId: string, headlineLevel: 'Need to get going' | 'Partially prepared' | 'Fully prepared'): UserProgress {
  const current = getProgressSnapshot();
  const updated: UserProgress = {
    ...current,
    buddies: current.buddies.map((b) =>
      b.id === buddyId ? { ...b, headlineLevel, lastSynced: new Date().toISOString() } : b
    ),
  };
  saveStoredProgress(updated);
  return updated;
}

export function removeAccountabilityBuddy(buddyId: string): UserProgress {
  const current = getProgressSnapshot();
  const updated: UserProgress = {
    ...current,
    buddies: current.buddies.filter((b) => b.id !== buddyId),
  };
  saveStoredProgress(updated);
  return updated;
}

export function regenerateRecoveryToken(): UserProgress {
  const current = getProgressSnapshot();
  const newToken = generateRandomToken();
  const updated: UserProgress = {
    ...current,
    recoveryToken: newToken,
    lastBackupTime: null,
  };
  saveStoredProgress(updated);
  return updated;
}

export function updateEmergencyPlan(plan: EmergencyPlan): UserProgress {
  const current = getProgressSnapshot();
  const updated: UserProgress = {
    ...current,
    emergencyPlan: plan,
  };
  saveStoredProgress(updated);
  return updated;
}

export function updateUtilityPlan(plan: UtilityShutoffPlan): UserProgress {
  const current = getProgressSnapshot();
  const updated: UserProgress = {
    ...current,
    utilityPlan: plan,
  };
  saveStoredProgress(updated);
  return updated;
}

export function togglePantryItem(itemId: string): UserProgress {
  const current = getProgressSnapshot();
  const currentPantry = current.pantryChecklist || {};
  const updatedPantry = {
    ...currentPantry,
    [itemId]: !currentPantry[itemId],
  };
  const updated: UserProgress = {
    ...current,
    pantryChecklist: updatedPantry,
  };
  saveStoredProgress(updated);
  return updated;
}

export function setAllPantryItems(itemIds: string[], value: boolean): UserProgress {
  const current = getProgressSnapshot();
  const updatedPantry: Record<string, boolean> = { ...(current.pantryChecklist || {}) };
  itemIds.forEach((id) => {
    updatedPantry[id] = value;
  });
  const updated: UserProgress = {
    ...current,
    pantryChecklist: updatedPantry,
  };
  saveStoredProgress(updated);
  return updated;
}

export async function uploadEncryptedBackup(progress: UserProgress): Promise<{ success: boolean; updatedAt?: string; error?: string }> {
  try {
    const rawData = JSON.stringify(progress);
    const encryptedPayload = await encryptPayload(rawData, progress.recoveryToken);
    const score = calculateHouseholdReadyScore(progress, rawChecklist as ChecklistItem[]);

    const res = await fetch('/api/backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recoveryToken: progress.recoveryToken,
        prepId: progress.prepId,
        encryptedPayload,
        headlineLevel: score.level,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Backup failed' };
    }

    const data = await res.json();
    const updated = {
      ...progress,
      cloudBackupEnabled: true,
      lastBackupTime: data.updatedAt || new Date().toISOString(),
    };
    saveStoredProgress(updated);
    return { success: true, updatedAt: data.updatedAt };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function restoreFromRecoveryToken(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanToken = token.trim();
    const res = await fetch(`/api/backup?token=${encodeURIComponent(cleanToken)}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Backup recovery record not found' };
    }

    const data = await res.json();
    const decryptedJson = await decryptPayload(data.encryptedPayload, cleanToken);
    const restored = JSON.parse(decryptedJson) as UserProgress;

    // Safety checks
    if (!restored.prepId) {
      return { success: false, error: 'Restored data corrupted or invalid token' };
    }

    saveStoredProgress(restored);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export function markBriefingAsReadStorage(briefingId: string): UserProgress {
  const current = getProgressSnapshot();
  if (current.readBriefingIds.includes(briefingId)) {
    return current;
  }
  const updated: UserProgress = {
    ...current,
    readBriefingIds: [...current.readBriefingIds, briefingId],
  };
  saveStoredProgress(updated);
  return updated;
}

export function saveQuestionAnswerStorage(
  questionId: string,
  selectedIndex: number,
  isCorrect: boolean
): UserProgress {
  const current = getProgressSnapshot();
  const updated: UserProgress = {
    ...current,
    answeredQuestions: {
      ...current.answeredQuestions,
      [questionId]: {
        selectedIndex,
        isCorrect,
        timestamp: new Date().toISOString(),
      },
    },
  };
  saveStoredProgress(updated);
  return updated;
}

export function resetChecklistStorage(): UserProgress {
  const current = getProgressSnapshot();
  const updated: UserProgress = {
    ...current,
    checklistStatuses: {},
    completedChecklistIds: [],
  };
  saveStoredProgress(updated);
  return updated;
}

/**
 * Permanently purges all user data and resets application state to baseline (GDPR Art. 17 Right to Erasure).
 */
export function purgeAllUserData(): UserProgress {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem('udss_gdpr_acknowledged_v1');
    } catch (e) {
      console.error('Failed to purge local storage', e);
    }
  }
  const fresh: UserProgress = {
    ...defaultProgress,
    prepId: generatePrepId(),
    recoveryToken: generateRandomToken(),
  };
  saveStoredProgress(fresh);
  return fresh;
}

/**
 * Generates a structured JSON export of all personal data held for GDPR Art. 15 & 20 Data Portability.
 */
export function exportAllUserDataJson(): string {
  const current = getProgressSnapshot();
  const exportPayload = {
    gdprNotice: 'UDSS Civilian Preparedness Assistant - GDPR Article 20 Personal Data Export',
    dateExported: new Date().toISOString(),
    dataController: 'Universal Defence and Security Solutions Ltd, 33 Cannon St, London EC4M 5SB',
    legalBasis: 'UK GDPR / Data Protection Act 2018 - Privacy by Design (Client-side Local Processing)',
    userRecord: current,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Checks if the user has acknowledged the GDPR Privacy Notice.
 */
export function isGDPRAcknowledged(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem('udss_gdpr_acknowledged_v1') === 'true';
  } catch {
    return true;
  }
}

/**
 * Marks the GDPR Privacy Notice as acknowledged.
 */
export function setGDPRAcknowledged(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('udss_gdpr_acknowledged_v1', 'true');
  } catch (e) {
    console.error('Failed to set GDPR acknowledgement', e);
  }
}
