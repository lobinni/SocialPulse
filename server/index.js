// ══════════════════════════════════════════════════════════════
//  SocialPulse — X (Twitter) API Proxy Server
//  Fetches real X data and serves it to the frontend.
// ══════════════════════════════════════════════════════════════
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const BEARER = process.env.X_BEARER_TOKEN;
const BASE = process.env.X_API_BASE_URL || "https://api.x.com/2";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

if (!BEARER || BEARER === "your_bearer_token_here") {
  console.warn(
    "\n⚠️  X_BEARER_TOKEN is not set!\n" +
      "   Copy .env.example to .env and add your token.\n" +
      "   The server will return mock/empty data.\n"
  );
}

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// ── Helper: call X API ──
async function xFetch(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${BEARER}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`X API ${res.status}: ${body}`);
  }
  return res.json();
}

// ═══════════════════════════════════
//  ENDPOINTS
// ═══════════════════════════════════

// Health check
app.get("/api/x/health", (_req, res) => {
  res.json({
    status: "ok",
    hasToken: !!BEARER && BEARER !== "your_bearer_token_here",
    apiBase: BASE,
  });
});

// ── Search tweets mentioning @GenLayer ──
// GET /api/x/search?q=@GenLayer&max_results=20
app.get("/api/x/search", async (req, res) => {
  try {
    const query = req.query.q || "@GenLayer";
    const maxResults = Math.min(Number(req.query.max_results) || 20, 100);

    if (!BEARER || BEARER === "your_bearer_token_here") {
      return res.json({ data: [], meta: { result_count: 0 }, _mock: true });
    }

    const data = await xFetch("/tweets/search/recent", {
      query,
      max_results: maxResults,
      "tweet.fields": "created_at,public_metrics,author_id,lang",
      expansions: "author_id",
      "user.fields": "name,username,profile_image_url,verified,public_metrics,description",
    });

    // Transform to our format
    const users = {};
    if (data.includes?.users) {
      data.includes.users.forEach((u) => {
        users[u.id] = u;
      });
    }

    const tweets = (data.data || []).map((t) => {
      const author = users[t.author_id] || {};
      const pm = t.public_metrics || {};
      return {
        id: t.id,
        text: t.text,
        created_at: t.created_at,
        author: {
          id: t.author_id,
          name: author.name || "Unknown",
          username: author.username || "unknown",
          avatar: author.profile_image_url || "",
          verified: author.verified || false,
          followers: author.public_metrics?.followers_count || 0,
          description: author.description || "",
        },
        metrics: {
          likes: pm.like_count || 0,
          retweets: pm.retweet_count || 0,
          replies: pm.reply_count || 0,
          views: pm.impression_count || 0,
          quotes: pm.quote_count || 0,
          bookmarks: pm.bookmark_count || 0,
        },
      };
    });

    res.json({
      data: tweets,
      meta: data.meta || { result_count: tweets.length },
    });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Get user profile ──
// GET /api/x/user/:username
app.get("/api/x/user/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!BEARER || BEARER === "your_bearer_token_here") {
      return res.json({ data: null, _mock: true });
    }

    const data = await xFetch(`/users/by/username/${username}`, {
      "user.fields":
        "created_at,description,location,profile_image_url,public_metrics,url,verified,pinned_tweet_id",
    });

    if (!data.data) {
      return res.status(404).json({ error: "User not found" });
    }

    const u = data.data;
    const pm = u.public_metrics || {};

    res.json({
      data: {
        id: u.id,
        name: u.name,
        username: u.username,
        avatar: u.profile_image_url || "",
        bio: u.description || "",
        location: u.location || "",
        url: u.url || "",
        verified: u.verified || false,
        created_at: u.created_at,
        followers: pm.followers_count || 0,
        following: pm.following_count || 0,
        tweet_count: pm.tweet_count || 0,
        listed_count: pm.listed_count || 0,
      },
    });
  } catch (err) {
    console.error("User lookup error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Get user's tweets ──
// GET /api/x/user/:username/tweets?max_results=10
app.get("/api/x/user/:username/tweets", async (req, res) => {
  try {
    const { username } = req.params;
    const maxResults = Math.min(Number(req.query.max_results) || 10, 100);

    if (!BEARER || BEARER === "your_bearer_token_here") {
      return res.json({ data: [], meta: { result_count: 0 }, _mock: true });
    }

    // First get user ID
    const userData = await xFetch(`/users/by/username/${username}`, {
      "user.fields": "name,username,profile_image_url,verified,public_metrics",
    });

    if (!userData.data) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userData.data.id;
    const author = userData.data;

    // Then get their tweets
    const tweetsData = await xFetch(`/users/${userId}/tweets`, {
      max_results: maxResults,
      "tweet.fields": "created_at,public_metrics",
      exclude: "retweets,replies",
    });

    const tweets = (tweetsData.data || []).map((t) => {
      const pm = t.public_metrics || {};
      return {
        id: t.id,
        text: t.text,
        created_at: t.created_at,
        author: {
          id: userId,
          name: author.name,
          username: author.username,
          avatar: author.profile_image_url || "",
          verified: author.verified || false,
          followers: author.public_metrics?.followers_count || 0,
        },
        metrics: {
          likes: pm.like_count || 0,
          retweets: pm.retweet_count || 0,
          replies: pm.reply_count || 0,
          views: pm.impression_count || 0,
        },
      };
    });

    res.json({
      data: tweets,
      meta: tweetsData.meta || { result_count: tweets.length },
    });
  } catch (err) {
    console.error("User tweets error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n🚀 SocialPulse X API Proxy running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/x/health`);
  console.log(`   CORS:   ${CORS_ORIGIN}\n`);
});
