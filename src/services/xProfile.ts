// ── X (Twitter) Profile Connection Service ──

export interface XProfile {
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  tweets: number;
  verified: boolean;
  joinDate: string;
  location: string;
  website: string;
  connected: boolean;
  connectedAt: number;
}

export interface MyMindshare {
  score: number;
  rank: number;
  totalParticipants: number;
  change: number;
  mentions: number;
  sentiment: number;
  topTopics: string[];
  weeklyTrend: { week: string; score: number }[];
}

// ── Storage ──
export function getStoredXProfile(): XProfile | null {
  try {
    const stored = localStorage.getItem("x_profile");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

export function connectXProfile(handle: string): XProfile {
  // Simulate connecting - in production this would OAuth with X
  const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;
  const profile: XProfile = {
    handle: cleanHandle,
    name: cleanHandle.replace("@", "").replace(/([A-Z])/g, " $1").trim() || cleanHandle.slice(1),
    avatar: "👤",
    bio: `Builder on GenLayer | ${cleanHandle} on X`,
    followers: Math.floor(Math.random() * 50000 + 500),
    following: Math.floor(Math.random() * 2000 + 100),
    tweets: Math.floor(Math.random() * 10000 + 200),
    verified: Math.random() > 0.6,
    joinDate: "Jan 2020",
    location: "Web3",
    website: "genlayer.com",
    connected: true,
    connectedAt: Date.now(),
  };
  localStorage.setItem("x_profile", JSON.stringify(profile));
  return profile;
}

export function disconnectXProfile(): void {
  localStorage.removeItem("x_profile");
}

export function getMyMindshare(handle: string): MyMindshare {
  // Simulated mindshare data based on the handle
  const seed = handle.length * 7;
  return {
    score: parseFloat(((seed % 15) + 1.2).toFixed(1)),
    rank: (seed % 40) + 8,
    totalParticipants: 156,
    change: parseFloat(((seed % 8) - 3).toFixed(1)),
    mentions: Math.floor(Math.random() * 5000 + 200),
    sentiment: Math.floor(Math.random() * 30 + 55),
    topTopics: ["GenLayer", "AI", "Web3", "Crypto"].slice(0, 3 + (seed % 2)),
    weeklyTrend: [
      { week: "W1", score: 2.1 + (seed % 3) },
      { week: "W2", score: 2.4 + (seed % 4) },
      { week: "W3", score: 2.8 + (seed % 3) },
      { week: "W4", score: 3.2 + (seed % 5) },
      { week: "W5", score: 3.0 + (seed % 4) },
      { week: "W6", score: 3.5 + (seed % 3) },
      { week: "W7", score: 3.8 + (seed % 4) },
      { week: "W8", score: 4.1 + (seed % 3) },
    ],
  };
}
