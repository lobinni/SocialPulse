import { useState, useMemo } from "react";
import { Search, Heart, Repeat2, MessageCircle, Eye, Filter, X, Zap, ExternalLink, Loader2, Award, Crown, Radio, Database } from "lucide-react";
import { mindshareRankings, tweets as mockTweets } from "../data/mockData";
import { formatNumber, getSentimentBg, getTrendColor } from "../utils/format";
import { searchGenLayerTweets, calculateMindshare, isProxyConfigured, type XTweet } from "../services/xApi";
import GasConfirmModal from "./GasConfirmModal";

function getMindshareForUser(handle: string) {
  return mindshareRankings.find(m => m.handle.toLowerCase() === ("@" + handle).toLowerCase() || m.handle.toLowerCase() === handle.toLowerCase()) || null;
}

// Simple sentiment analysis based on keywords
function analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
  const lower = text.toLowerCase();
  const posWords = ["great", "amazing", "incredible", "love", "bullish", "live", "success", "brilliant", "smooth", "excited", "impressive", "solid", "🚀", "🔥", "💪", "🎉"];
  const negWords = ["concern", "issue", "bug", "problem", "worried", "fail", "bad", "slow", "down", "⚠️", "warning", "centralization"];
  const posCount = posWords.filter(w => lower.includes(w)).length;
  const negCount = negWords.filter(w => lower.includes(w)).length;
  if (posCount > negCount) return "positive";
  if (negCount > posCount) return "negative";
  return "neutral";
}

// Extract topics from text
function extractTopics(text: string): string[] {
  const topics: string[] = [];
  const hashtags = text.match(/#\w+/g);
  if (hashtags) topics.push(...hashtags.map(h => h.slice(1)));
  if (text.toLowerCase().includes("genlayer")) topics.push("GenLayer");
  if (text.toLowerCase().includes("genvm")) topics.push("GenVM");
  if (text.toLowerCase().includes("intelligent contract")) topics.push("IntelligentContracts");
  if (text.toLowerCase().includes("testnet")) topics.push("Testnet");
  if (text.toLowerCase().includes("staking") || text.toLowerCase().includes("validator")) topics.push("Staking");
  return [...new Set(topics)].slice(0, 4);
}

export default function SearchPosts() {
  const [query, setQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMindsharePanel, setShowMindsharePanel] = useState(true);

  // Results state
  const [loadedTweets, setLoadedTweets] = useState<XTweet[]>([]);
  const [isLiveData, setIsLiveData] = useState(false);
  const hasProxy = isProxyConfigured();

  // Removed unused allTopics

  // Filter loaded tweets
  const filtered = useMemo(() => {
    return loadedTweets.filter((t) => {
      const matchQuery = !query ||
        t.text.toLowerCase().includes(query.toLowerCase()) ||
        t.author.name.toLowerCase().includes(query.toLowerCase()) ||
        t.author.username.toLowerCase().includes(query.toLowerCase());
      const sentiment = analyzeSentiment(t.text);
      const matchSentiment = sentimentFilter === "all" || sentiment === sentimentFilter;
      return matchQuery && matchSentiment;
    });
  }, [loadedTweets, query, sentimentFilter]);

  // Calculate mindshare from loaded data
  const liveMindshare = useMemo(() => {
    return calculateMindshare(loadedTweets);
  }, [loadedTweets]);

  const handleLoadPosts = () => setShowGasModal(true);

  const handleGasConfirm = async () => {
    setShowGasModal(false);
    setIsLoading(true);

    try {
      const result = await searchGenLayerTweets("@GenLayer", 50);
      setLoadedTweets(result.tweets);
      setIsLiveData(result.isLive);
    } catch {
      // Fallback: use all mock tweets
      const { searchGenLayerTweets: search } = await import("../services/xApi");
      const result = await search("GenLayer", 50);
      setLoadedTweets(result.tweets);
      setIsLiveData(false);
    }

    setHasLoaded(true);
    setIsLoading(false);
  };

  const clearFilters = () => {
    setQuery("");
    setSentimentFilter("all");
  };

  // ── Initial state ──
  if (!hasLoaded && !isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Search @GenLayer Posts</h1>
          <p className="mt-1 text-sm text-dark-400">View all posts about @GenLayer with mindshare analytics</p>
        </div>

        {/* Data source indicator */}
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${hasProxy ? "border-emerald-500/20 bg-emerald-500/5" : "border-violet-500/20 bg-violet-500/5"}`}>
          {hasProxy ? <Radio size={18} className="text-emerald-400" /> : <Database size={18} className="text-violet-400" />}
          <div>
            <p className="text-xs font-medium text-white">
              {hasProxy ? "🟢 Live X API Connected" : "📦 Demo Mode — Mock Data"}
            </p>
            <p className="text-[10px] text-dark-400">
              {hasProxy
                ? "Fetching real-time data from X (Twitter) via proxy server"
                : "Set VITE_X_API_PROXY_URL to fetch real posts. See server/README.md"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-brand-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Search size={20} className="text-violet-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">GenLayer Social Intelligence</h4>
              <p className="text-xs text-dark-400 leading-relaxed mb-3">
                {hasProxy
                  ? <>Fetches <strong className="text-emerald-400">real posts</strong> mentioning <strong className="text-violet-400">@GenLayer</strong> from X via the proxy API, then calculates mindshare on-chain.</>
                  : <>Uses mock data to demonstrate how posts about <strong className="text-violet-400">@GenLayer</strong> are analyzed. Connect a proxy server with an X API key for live data.</>
                }
              </p>
              <a href="https://x.com/GenLayer" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300">
                View @GenLayer on X <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{hasProxy ? "Live" : mockTweets.length}</p>
            <p className="text-xs text-dark-400">{hasProxy ? "Real-time Feed" : "Mock Posts"}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{mindshareRankings.length}</p>
            <p className="text-xs text-dark-400">Contributors Ranked</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{hasProxy ? "Real" : "AI"}</p>
            <p className="text-xs text-dark-400">Sentiment Analysis</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10"><Zap size={20} className="text-amber-400" /></div>
            <div>
              <p className="text-sm font-medium text-white">Gas Required to Fetch Posts</p>
              <p className="text-xs text-dark-400">{hasProxy ? "Fetch live @GenLayer posts from X" : "Load mock @GenLayer posts with mindshare"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-amber-400">0.0012 GEN</p>
            <p className="text-[10px] text-dark-500">≈ $0.00018 USD</p>
          </div>
        </div>

        <button onClick={handleLoadPosts}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all">
          <Zap size={16} /> Sign & Load @GenLayer Posts
        </button>

        <GasConfirmModal isOpen={showGasModal} action="search_posts"
          description="Fetch all posts about @GenLayer with mindshare analytics"
          onConfirm={handleGasConfirm} onCancel={() => setShowGasModal(false)} />
      </div>
    );
  }

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-bold text-white">Search @GenLayer Posts</h1></div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <Loader2 size={48} className="text-brand-400 animate-spin mb-4" />
          <h3 className="text-white font-semibold mb-2">{hasProxy ? "Fetching live posts from X..." : "Loading @GenLayer posts..."}</h3>
          <p className="text-xs text-dark-400 mb-4">
            {hasProxy ? "Querying X API via proxy server" : "GenLayer validators calculating mindshare"}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-dark-500">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gas: 0.0012 GEN</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Loaded — Main View ──
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">@GenLayer Posts</h1>
          <p className="mt-1 text-sm text-dark-400">
            {filtered.length} posts •{" "}
            <span className={isLiveData ? "text-emerald-400" : "text-violet-400"}>
              {isLiveData ? "🟢 Live from X" : "📦 Mock data"}
            </span>
            {" • "}
            <a href="https://x.com/GenLayer" target="_blank" rel="noopener noreferrer"
              className="text-brand-400 hover:underline inline-flex items-center gap-0.5">
              @GenLayer <ExternalLink size={10} />
            </a>
          </p>
        </div>
        <button onClick={() => setShowMindsharePanel(!showMindsharePanel)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${showMindsharePanel ? "bg-brand-600/20 text-brand-400" : "bg-dark-800 text-dark-400 hover:text-white"}`}>
          <Award size={14} /> Mindshare
        </button>
      </div>

      <div className="flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter posts..." className="w-full rounded-xl border border-white/10 bg-dark-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-dark-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20" />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-dark-500" />
              <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-dark-900/60 px-3 py-2.5 text-sm text-dark-300 outline-none">
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
              {(query || sentimentFilter !== "all") && (
                <button onClick={clearFilters} className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2.5 text-xs text-dark-400 hover:bg-white/5 hover:text-white"><X size={14} /> Clear</button>
              )}
            </div>
          </div>

          {/* Tweet List */}
          <div className="space-y-3">
            {filtered.map((tweet) => {
              const ms = getMindshareForUser(tweet.author.username);
              const sentiment = analyzeSentiment(tweet.text);
              const topics = extractTopics(tweet.text);

              return (
                <div key={tweet.id} className="group rounded-xl border border-white/5 bg-dark-900/60 p-5 transition-all hover:border-white/10 hover:bg-dark-900/80">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-dark-800 text-xl overflow-hidden">
                      {tweet.author.avatar && tweet.author.avatar.startsWith("http")
                        ? <img src={tweet.author.avatar} alt="" className="h-full w-full object-cover" />
                        : <span>{tweet.author.avatar || "👤"}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{tweet.author.name}</span>
                          {tweet.author.verified && (
                            <svg className="h-4 w-4 text-brand-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" /></svg>
                          )}
                          <span className="text-xs text-dark-500">@{tweet.author.username}</span>
                          <span className="text-xs text-dark-600">·</span>
                          <span className="text-xs text-dark-500">{tweet.created_at}</span>
                        </div>
                        {ms && (
                          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
                            {ms.rank === 1 && <Crown size={10} />}#{ms.rank} • {ms.mindshare}%
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-dark-200">{tweet.text}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {topics.map((t) => (<span key={t} className="rounded-md bg-brand-600/10 px-2 py-0.5 text-[11px] font-medium text-brand-400">#{t}</span>))}
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${getSentimentBg(sentiment)}`}>{sentiment}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-5 text-dark-500">
                        <span className="flex items-center gap-1.5 text-xs"><Heart size={14} /> {formatNumber(tweet.metrics.likes)}</span>
                        <span className="flex items-center gap-1.5 text-xs"><Repeat2 size={14} /> {formatNumber(tweet.metrics.retweets)}</span>
                        <span className="flex items-center gap-1.5 text-xs"><MessageCircle size={14} /> {formatNumber(tweet.metrics.replies)}</span>
                        <span className="flex items-center gap-1.5 text-xs"><Eye size={14} /> {formatNumber(tweet.metrics.views)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-16">
                <Search size={40} className="text-dark-600" />
                <p className="mt-4 text-sm text-dark-400">No posts match your filters</p>
                <button onClick={clearFilters} className="mt-2 text-xs text-brand-400 hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        </div>

        {/* Mindshare Sidebar */}
        {showMindsharePanel && (
          <div className="hidden lg:block w-72 shrink-0 space-y-4">
            <div className="rounded-xl border border-white/5 bg-dark-900/60 p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Award size={14} className="text-amber-400" />
                  {isLiveData ? "Live Mindshare" : "Top Mindshare"}
                </h3>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${isLiveData ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-400"}`}>
                  {isLiveData ? "LIVE" : "MOCK"}
                </span>
              </div>
              <div className="space-y-2">
                {isLiveData
                  ? liveMindshare.slice(0, 7).map((m, idx) => (
                    <div key={m.username} className="flex items-center gap-3 rounded-lg bg-dark-800/50 p-2.5">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${idx === 0 ? "bg-amber-500/20 text-amber-400" : idx === 1 ? "bg-dark-600/50 text-dark-300" : idx === 2 ? "bg-orange-900/30 text-orange-500" : "bg-dark-700 text-dark-500"}`}>{idx === 0 ? <Crown size={12} /> : m.rank}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-white truncate block">{m.name}</span>
                        <p className="text-[10px] text-dark-500">@{m.username}</p>
                      </div>
                      <p className="text-xs font-bold text-white">{m.mindshare}%</p>
                    </div>
                  ))
                  : mindshareRankings.slice(0, 7).map((m, idx) => (
                    <div key={m.handle} className="flex items-center gap-3 rounded-lg bg-dark-800/50 p-2.5">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${idx === 0 ? "bg-amber-500/20 text-amber-400" : idx === 1 ? "bg-dark-600/50 text-dark-300" : idx === 2 ? "bg-orange-900/30 text-orange-500" : "bg-dark-700 text-dark-500"}`}>{idx === 0 ? <Crown size={12} /> : m.rank}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-white truncate block">{m.name}</span>
                        <p className="text-[10px] text-dark-500">{m.handle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">{m.mindshare}%</p>
                        <p className={`text-[10px] ${getTrendColor(m.change)}`}>{m.change > 0 ? "+" : ""}{m.change}%</p>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[10px] text-dark-500 text-center">
                  {isLiveData ? "Calculated from live X data" : "Based on mock ecosystem data"}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-dark-400">Gas Used</span>
                <span className="text-amber-400 font-medium">0.0012 GEN</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
