export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  accessToken: string;
  expiresAt: number;
}

export interface CloudSyncStatus {
  isSyncing: boolean;
  lastSyncTimestamp: string | null;
  syncedProjectsCount: number;
  error?: string | null;
}
