export interface StoredSafeAccount {
  id: string;
  name: string;
  address: string;
  network: string;
  networks: string[];
  threshold: string;
  balance: string;
  signers: { id: string; name: string; address: string }[];
  isRegistered: boolean;
  createdAt: number;
}

export interface StoredWorkspace {
  id: string;
  name: string;
  accountsCount: number;
  membersCount: number;
  avatarLetter: string;
}

const STORAGE_KEY = "sentinel_safes";
const WORKSPACE_KEY = "sentinel_workspaces";

export function getStoredSafes(): StoredSafeAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse stored safes:", err);
    return [];
  }
}

export function saveStoredSafe(safe: StoredSafeAccount): StoredSafeAccount[] {
  const existing = getStoredSafes();
  const updated = [safe, ...existing.filter((s) => s.id !== safe.id)];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function removeStoredSafe(id: string): StoredSafeAccount[] {
  const existing = getStoredSafes();
  const updated = existing.filter((s) => s.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getStoredWorkspaces(): StoredWorkspace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse stored workspaces:", err);
    return [];
  }
}

export function saveStoredWorkspace(workspace: StoredWorkspace): StoredWorkspace[] {
  const existing = getStoredWorkspaces();
  const updated = [workspace, ...existing.filter((w) => w.id !== workspace.id)];
  if (typeof window !== "undefined") {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(updated));
  }
  return updated;
}
