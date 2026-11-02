// Server-side minimal encrypted repository & public status cache
// Strictly zero PII: stores encrypted opaque blobs keyed by high-entropy UUID recovery token.
// Public status records contain only the UDSS Prep ID and headline preparedness level.

interface BackupRecord {
  recoveryToken: string;
  prepId: string;
  encryptedPayload: string; // AES-GCM or opaque ciphertext
  updatedAt: string;
}

interface PublicStatusRecord {
  prepId: string;
  headlineLevel: 'Need to get going' | 'Partially prepared' | 'Fully prepared';
  updatedAt: string;
}

// Global in-memory map persisted across requests in standard server runtime
const globalStore = global as unknown as {
  __udssBackups?: Map<string, BackupRecord>;
  __udssStatuses?: Map<string, PublicStatusRecord>;
};

if (!globalStore.__udssBackups) {
  globalStore.__udssBackups = new Map<string, BackupRecord>();
}
if (!globalStore.__udssStatuses) {
  globalStore.__udssStatuses = new Map<string, PublicStatusRecord>();
}

export const backupsMap = globalStore.__udssBackups;
export const statusesMap = globalStore.__udssStatuses;
