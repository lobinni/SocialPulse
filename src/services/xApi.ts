// ══════════════════════════════════════════════════════════
//  X (Twitter) API Service
//  Calls the proxy server if available, falls back to mock data.
// ══════════════════════════════════════════════════════════

import { tweets as mockTweets, mindshareRankings } from "../data/mockData";

// Proxy URL — user sets this via env or the Settings panel
const PROXY_URL: string = (import.meta as unknown as { env: Record<string, string> }).env.VITE_X_API_PROXY_URL || "";

// ── Types ──
export interface XTweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    followers: number;
    description?: string;
  };
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    views: number;
  };
}

export interface XUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  url: string;
  verified: boolean;
  created_at: string;
  followers: number;
  following: number;
  tweet_count: number;
}

// ── Check if live API is available ──
export async function checkProxyHealth(): Promise<{
  available: boolean;
  hasToken: boolean;
}> {
  if (!PROXY_URL) return { available: false, hasToken: false };

  try {
    const res = await fetch(`${PROXY_URL}/api/x/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { available: false, hasToken: false };
    const data = await res.json();
    return { available: true, hasToken: data.hasToken || false };
  } catch {
    return { available: false, hasToken: false };
  }
}

// ── Search tweets about @GenLayer ──
export async function searchGenLayerTweets(
  query = "@GenLayer",
  maxResults = 20
): Promise<{ tweets: XTweet[]; isLive: boolean }> {
  // Try live API first
  if (PROXY_URL) {
    try {
      const res = await fetch(
        `${PROXY_URL}/api/x/search?q=${encodeURIComponent(query)}&max_results=${maxResults}`
      );
      if (res.ok) {
        const data = await res.json();
        if (!data._mock && data.data && data.data.length > 0) {
          return { tweets: data.data, isLive: true };
        }
      }
    } catch {
      // Fall through to mock
    }
  }

  // Fallback: mock data
  const filtered = mockTweets.filter((t) => {
    const q = query.toLowerCase();
    return (
      t.content.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.handle.toLowerCase().includes(q) ||
      t.topics.some((tp) => tp.toLowerCase().includes(q))
    );
  });

  return {
    tweets: filtered.map(mockToXTweet),
    isLive: false,
  };
}

// ── Get user profile ──
export async function getXUserProfile(
  username: string
): Promise<{ user: XUser | null; isLive: boolean }> {
  if (PROXY_URL) {
    try {
      const res = await fetch(
        `${PROXY_URL}/api/x/user/${encodeURIComponent(username)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (!data._mock && data.data) {
          return { user: data.data, isLive: true };
        }
      }
    } catch {
      // Fall through
    }
  }

  // Mock fallback
  return { user: null, isLive: false };
}

// ── Get user's tweets ──
export async function getXUserTweets(
  username: string,
  maxResults = 10
): Promise<{ tweets: XTweet[]; isLive: boolean }> {
  if (PROXY_URL) {
    try {
      const res = await fetch(
        `${PROXY_URL}/api/x/user/${encodeURIComponent(username)}/tweets?max_results=${maxResults}`
      );
      if (res.ok) {
        const data = await res.json();
        if (!data._mock && data.data && data.data.length > 0) {
          return { tweets: data.data, isLive: true };
        }
      }
    } catch {
      // Fall through
    }
  }

  // Mock fallback: find tweets by this handle
  const handle = username.startsWith("@") ? username : `@${username}`;
  const filtered = mockTweets.filter(
    (t) => t.handle.toLowerCase() === handle.toLowerCase()
  );
  return {
    tweets: filtered.map(mockToXTweet),
    isLive: false,
  };
}

// ── Calculate mindshare from tweets ──
export function calculateMindshare(allTweets: XTweet[]) {
  const userMap: Record<
    string,
    {
      username: string;
      name: string;
      avatar: string;
      verified: boolean;
      followers: number;
      posts: number;
      engagement: number;
      views: number;
    }
  > = {};

  allTweets.forEach((t) => {
    const key = t.author.username.toLowerCase();
    if (!userMap[key]) {
      userMap[key] = {
        username: t.author.username,
        name: t.author.name,
        avatar: t.author.avatar,
        verified: t.author.verified,
        followers: t.author.followers,
        posts: 0,
        engagement: 0,
        views: 0,
      };
    }
    userMap[key].posts += 1;
    userMap[key].engagement +=
      t.metrics.likes + t.metrics.retweets + t.metrics.replies;
    userMap[key].views += t.metrics.views;
    // Keep the highest follower count
    if (t.author.followers > userMap[key].followers) {
      userMap[key].followers = t.author.followers;
    }
  });

  const entries = Object.values(userMap);
  const totalEngagement = entries.reduce((s, e) => s + e.engagement, 0) || 1;

  return entries
    .map((e) => ({
      ...e,
      mindshare: parseFloat(
        ((e.engagement / totalEngagement) * 100).toFixed(1)
      ),
    }))
    .sort((a, b) => b.mindshare - a.mindshare)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

// ── Check if proxy is configured ──
export function isProxyConfigured(): boolean {
  return !!PROXY_URL;
}

export function getProxyUrl(): string {
  return PROXY_URL;
}

// ── Helper: convert mock tweet to XTweet ──
function mockToXTweet(t: (typeof mockTweets)[number]): XTweet {
  const ms = mindshareRankings.find(
    (m) => m.handle.toLowerCase() === t.handle.toLowerCase()
  );
  return {
    id: t.id,
    text: t.content,
    created_at: t.timestamp,
    author: {
      id: t.profileId,
      name: t.name,
      username: t.handle.replace("@", ""),
      avatar: t.avatar,
      verified: t.verified,
      followers: ms?.mentions || 0,
    },
    metrics: {
      likes: t.likes,
      retweets: t.retweets,
      replies: t.replies,
      views: t.views,
    },
  };
}
