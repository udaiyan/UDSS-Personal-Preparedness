export interface BriefingSection {
  heading: string;
  paragraphs: string[];
}

export interface BriefingActionSection {
  heading: string;
  items: string[];
}

export interface BriefingQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Briefing {
  id: string;
  slug: string;
  month: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
  threatLevel: 'Low' | 'Moderate' | 'Substantial' | 'Severe' | 'Critical';
  introduction: string;
  section1: BriefingSection;
  section2: BriefingSection;
  section3: BriefingActionSection;
  conclusion: BriefingSection;
  question: BriefingQuestion;
}

export type ChecklistItemStatus = 'not_addressed' | 'in_progress' | 'completed' | 'not_relevant';

export interface ChecklistItem {
  id: string;
  tier: 'basic' | 'advanced';
  category: string;
  title: string;
  description: string;
  priority: 'Essential' | 'High' | 'Recommended' | 'Optional';
  tip: string;
  buyingGuidance?: string;
}

export interface HouseholdMember {
  id: string;
  category: 'adult' | 'child' | 'infant' | 'senior';
  label: string;
  specialNeeds: {
    mobilityIssue?: boolean;
    requiresRefrigeration?: boolean;
    dietaryRestrictions?: string;
  };
}

export interface HouseholdProfile {
  members: HouseholdMember[];
  hasPets: boolean;
  petCount: number;
  hasCompletedOnboarding: boolean;
}

export interface GrabBagItem {
  id: string;
  label: string;
  isPacked: boolean;
}

export interface IndividualGrabBag {
  memberId: string;
  label: string;
  role: 'adult' | 'child' | 'infant' | 'senior' | 'pet';
  items: GrabBagItem[];
  isComplete: boolean;
}

export type NicknamePreset =
  | 'Partner'
  | 'Wife'
  | 'Husband'
  | 'Mother'
  | 'Father'
  | 'Sister'
  | 'Brother'
  | 'Son'
  | 'Daughter'
  | 'Friend'
  | 'Work friend'
  | 'Neighbour'
  | 'Other';

export interface AccountabilityBuddy {
  id: string;
  prepId: string; // e.g. "UDSS 3456"
  nicknamePreset: NicknamePreset;
  nicknameIndex: number; // e.g. 1 -> "Sister - 1"
  headlineLevel: 'Need to get going' | 'Partially prepared' | 'Fully prepared';
  lastSynced: string;
}

export interface EmergencyPlan {
  primaryContactName: string;
  primaryContactPhone: string;
  outOfAreaContactName: string;
  outOfAreaContactPhone: string;
  primaryMeetingPoint: string;
  secondaryMeetingPoint: string;
  meetingTriggerTime: string;
  offlineCommsProtocol: string;
  gpSurgery: string;
  localPharmacy: string;
  essentialPrescriptions: string;
}

export interface UtilityShutoffPlan {
  waterStopcockLocation: string;
  electricityConsumerUnitLocation: string;
  gasMeterValveLocation: string;
  specialHazardsNotes: string;
}

export type ReadinessLevel = 'Need to get going' | 'Partially prepared' | 'Fully prepared';

export interface UserProgress {
  prepId: string; // e.g. "UDSS 3456"
  recoveryToken: string; // UUID token for encrypted central backup & recovery
  cloudBackupEnabled: boolean;
  lastBackupTime: string | null;
  householdProfile: HouseholdProfile;
  checklistStatuses: Record<string, ChecklistItemStatus>;
  completedChecklistIds: string[]; // For backwards-compatibility
  individualGrabBags: Record<string, IndividualGrabBag>;
  buddies: AccountabilityBuddy[];
  emergencyPlan: EmergencyPlan;
  utilityPlan: UtilityShutoffPlan;
  answeredQuestions: Record<string, { selectedIndex: number; isCorrect: boolean; timestamp: string }>;
  readBriefingIds: string[];
}
