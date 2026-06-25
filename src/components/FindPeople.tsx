import { useState, useMemo } from "react";
import {
  Search, Zap, Loader2, Heart, Repeat2, MessageCircle, Eye,
  ExternalLink, ArrowLeft, Award, Crown, TrendingUp, TrendingDown,
  MapPin, Calendar, Link2, BarChart3,
} from "lucide-react";
import { people, tweets, mindshareRankings, twitterProfiles } from "../data/mockData";
import { formatNumber, getSentimentBg, getTrendColor } from "../utils/format";
import GasConfirmModal from "./GasConfirmModal";

// ── helpers ──
function getMindshare(handle: string) {
  return mindshareRankings.find(
    (m) => m.handle.toLowerCase() === handle.toLowerCase()
  ) || null;
}
function getProfile(handle: string) {
  return twitterProfiles.find(
    (p) => p.handle.toLowerCase() === handle.toLowerCase()
  ) || null;
}
function getUserTweets(handle: string) {
  return tweets.filter(
    (t) => t.handle.toLowerCase() === handle.toLowerCase()
  );
}

export default function FindPeople() {
  const [query, setQuery] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);

  // Selected user detail
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null);
  const [showUserGas, setShowUserGas] = useState(false);
  const [pendingHandle, setPendingHandle] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // ── filter people list ──
  const filtered = useMemo(() => {
    if (!hasLoaded) return [];
    return people.filter((p) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, hasLoaded]);

  // ── selected user data ──
  const selectedMindshare = selectedHandle ? getMindshare(selectedHandle) : null;
  const selectedProfile = selectedHandle ? getProfile(selectedHandle) : null;
  const selectedPerson = selectedHandle
    ? people.find((p) => p.handle.toLowerCase() === selectedHandle.toLowerCase())
    : null;
  const selectedTweets = selectedHandle ? getUserTweets(selectedHandle) : [];

  // sentiment breakdown for the selected user
  const sentimentBreakdown = useMemo(() => {
    const pos = selectedTweets.filter((t) => t.sentiment === "positive").length;
    const neu = selectedTweets.filter((t) => t.sentiment === "neutral").length;
    const neg = selectedTweets.filter((t) => t.sentiment === "negative").length;
    const total = selectedTweets.length || 1;
    return {
      positive: Math.round((pos / total) * 100),
      neutral: Math.round((neu / total) * 100),
      negative: Math.round((neg / total) * 100),
      totalEngagement: selectedTweets.reduce(
        (s, t) => s + t.likes + t.retweets + t.replies,
        0
      ),
      totalViews: selectedTweets.reduce((s, t) => s + t.views, 0),
    };
  }, [selectedTweets]);

  // ── handlers ──
  const handleLoadList = () => setShowGasModal(true);

  const handleGasConfirmList = () => {
    setShowGasModal(false);
    setIsLoading(true);
    setTimeout(() => { setHasLoaded(true); setIsLoading(false); }, 1800);
  };

  const handleClickUser = (handle: string) => {
    setPendingHandle(handle);
    setShowUserGas(true);
  };

  const handleGasConfirmUser = () => {
    setShowUserGas(false);
    setIsLoadingUser(true);
    setTimeout(() => {
      setSelectedHandle(pendingHandle);
      setPendingHandle(null);
      setIsLoadingUser(false);
    }, 1500);
  };

  const handleBack = () => {
    setSelectedHandle(null);
  };

  // ══════════════════════════════
  // 1. Initial (not loaded yet)
  // ══════════════════════════════
  if (!hasLoaded && !isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Find People on X</h1>
          <p className="mt-1 text-sm text-dark-400">
            Search X users who post about{" "}
            <a href="https://x.com/GenLayer" target="_blank" rel="noopener noreferrer"
              className="text-brand-400 hover:underline inline-flex items-center gap-0.5">
              @GenLayer <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-brand-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Search size={20} className="text-violet-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">How It Works</h4>
              <p className="text-xs text-dark-400 leading-relaxed">
                GenLayer validators scan X for users who mention <strong className="text-violet-400">@GenLayer</strong>.
                Each user's <strong className="text-brand-400">mindshare score</strong> is computed from their mention frequency, engagement, and sentiment.
                Click any user to view their posts about GenLayer.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{people.length}</p>
            <p className="text-xs text-dark-400">X Users Tracked</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{mindshareRankings.length}</p>
            <p className="text-xs text-dark-400">Mindshare Ranked</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
            <p className="text-3xl font-bold text-white mb-1">{tweets.length}</p>
            <p className="text-xs text-dark-400">GenLayer Posts</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Zap size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Gas Required</p>
              <p className="text-xs text-dark-400">Fetch X users who mention @GenLayer</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-amber-400">0.0008 GEN</p>
            <p className="text-[10px] text-dark-500">≈ $0.00012 USD</p>
          </div>
        </div>

        <button onClick={handleLoadList}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all">
          <Zap size={16} /> Sign & Load X Users
        </button>

        <GasConfirmModal isOpen={showGasModal} action="search_people"
          description="Fetch X users who post about @GenLayer"
          onConfirm={handleGasConfirmList} onCancel={() => setShowGasModal(false)} />
      </div>
    );
  }

  // ══════════════════════════════
  // 2. Loading list
  // ══════════════════════════════
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Find People on X</h1>
          <p className="mt-1 text-sm text-dark-400">Scanning X for @GenLayer contributors...</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <Loader2 size={48} className="text-brand-400 animate-spin mb-4" />
          <h3 className="text-white font-semibold mb-2">Fetching X Users...</h3>
          <p className="text-xs text-dark-400 mb-4">Validators are scanning mentions of @GenLayer</p>
          <div className="flex items-center gap-2 text-[10px] text-dark-500">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Consensus in progress • Gas: 0.0008 GEN</span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════
  // 3. Loading user detail
  // ══════════════════════════════
  if (isLoadingUser) {
    const p = people.find((x) => x.handle.toLowerCase() === pendingHandle?.toLowerCase());
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Find People on X</h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <Loader2 size={48} className="text-brand-400 animate-spin mb-4" />
          <h3 className="text-white font-semibold mb-2">
            Loading {p?.name || pendingHandle}'s Posts...
          </h3>
          <p className="text-xs text-dark-400 mb-4">Fetching posts about @GenLayer by this user</p>
          <div className="flex items-center gap-2 text-[10px] text-dark-500">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gas: 0.0015 GEN</span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════
  // 4. User detail view
  // ══════════════════════════════
  if (selectedHandle) {
    const displayName = selectedPerson?.name || selectedProfile?.name || selectedHandle;
    const displayAvatar = selectedPerson?.avatar || selectedProfile?.avatar || "👤";
    const displayHandle = selectedPerson?.handle || selectedProfile?.handle || selectedHandle;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back */}
        <button onClick={handleBack}
          className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-brand-400 transition-colors">
          <ArrowLeft size={14} /> Back to all users
        </button>

        {/* ── Profile Header ── */}
        <div className="rounded-xl border border-white/5 bg-dark-900/60 overflow-hidden">
          {selectedProfile && (
            <div className={`h-28 bg-gradient-to-r ${selectedProfile.bannerColor}`} />
          )}
          <div className={`px-6 pb-6 ${selectedProfile ? "-mt-10" : "pt-6"}`}>
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-dark-900 bg-dark-800 text-4xl ${!selectedProfile ? "mt-0" : ""}`}>
                  {displayAvatar}
                </div>
                <div className="mb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{displayName}</h2>
                    {(selectedPerson?.handle === "@GenLayer" || selectedProfile?.verified) && (
                      <svg className="h-5 w-5 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-dark-400">{displayHandle}</p>
                </div>
              </div>

              {/* Mindshare badge */}
              {selectedMindshare && (
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                  {selectedMindshare.rank <= 3 && <Crown size={14} className="text-amber-400" />}
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">#{selectedMindshare.rank} Mindshare</p>
                    <p className="text-[10px] text-dark-400">{selectedMindshare.mindshare}% share</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bio / Meta */}
            {(selectedProfile?.bio || selectedPerson?.role) && (
              <p className="mt-3 text-sm text-dark-200">{selectedProfile?.bio || selectedPerson?.role}</p>
            )}
            {selectedProfile && (
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-dark-400">
                <span className="flex items-center gap-1"><MapPin size={12} /> {selectedProfile.location}</span>
                <span className="flex items-center gap-1"><Link2 size={12} /> {selectedProfile.website}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined {selectedProfile.joinDate}</span>
              </div>
            )}

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap gap-6 border-t border-white/5 pt-4">
              <div><span className="text-lg font-bold text-white">{formatNumber(selectedPerson?.followers || selectedProfile?.followers || 0)}</span><span className="ml-1 text-xs text-dark-500">Followers</span></div>
              {selectedProfile && <div><span className="text-lg font-bold text-white">{formatNumber(selectedProfile.following)}</span><span className="ml-1 text-xs text-dark-500">Following</span></div>}
              <div><span className="text-lg font-bold text-white">{selectedTweets.length}</span><span className="ml-1 text-xs text-dark-500">GenLayer Posts</span></div>
            </div>
          </div>
        </div>

        {/* ── Mindshare + Sentiment Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mindshare Card */}
          <div className="rounded-xl border border-white/5 bg-dark-900/60 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Award size={14} className="text-amber-400" /> Mindshare
            </h3>
            {selectedMindshare ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Rank</span>
                  <span className="text-sm font-bold text-white">#{selectedMindshare.rank} / {mindshareRankings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Score</span>
                  <span className="text-sm font-bold text-amber-400">{selectedMindshare.mindshare}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Change</span>
                  <span className={`text-sm font-bold ${getTrendColor(selectedMindshare.change)}`}>
                    {selectedMindshare.change > 0 ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                    {selectedMindshare.change > 0 ? "+" : ""}{selectedMindshare.change}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Mentions</span>
                  <span className="text-sm text-dark-200">{formatNumber(selectedMindshare.mentions)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Category</span>
                  <span className="rounded-md bg-dark-800 px-2 py-0.5 text-[10px] text-dark-300">{selectedMindshare.category}</span>
                </div>
                {/* Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] text-dark-500 mb-1">
                    <span>Mindshare</span><span>{selectedMindshare.mindshare}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-dark-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                      style={{ width: `${(selectedMindshare.mindshare / mindshareRankings[0].mindshare) * 100}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-dark-500">No mindshare data available for this user.</p>
            )}
          </div>

          {/* Sentiment Card */}
          <div className="rounded-xl border border-white/5 bg-dark-900/60 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 size={14} className="text-brand-400" /> Post Sentiment
            </h3>
            {selectedTweets.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Posts about GenLayer</span>
                  <span className="text-sm font-bold text-white">{selectedTweets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Total Engagement</span>
                  <span className="text-sm font-bold text-white">{formatNumber(sentimentBreakdown.totalEngagement)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">Total Views</span>
                  <span className="text-sm font-bold text-white">{formatNumber(sentimentBreakdown.totalViews)}</span>
                </div>
                {/* Sentiment bars */}
                <div className="pt-2 space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-emerald-400">Positive</span>
                      <span className="text-dark-400">{sentimentBreakdown.positive}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${sentimentBreakdown.positive}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-amber-400">Neutral</span>
                      <span className="text-dark-400">{sentimentBreakdown.neutral}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${sentimentBreakdown.neutral}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-rose-400">Negative</span>
                      <span className="text-dark-400">{sentimentBreakdown.negative}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800">
                      <div className="h-full rounded-full bg-rose-400" style={{ width: `${sentimentBreakdown.negative}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-dark-500">No GenLayer posts found for this user.</p>
            )}
          </div>
        </div>

        {/* ── Posts ── */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Posts about @GenLayer by {displayName}
            <span className="ml-2 text-dark-500 font-normal">({selectedTweets.length})</span>
          </h3>

          {selectedTweets.length > 0 ? (
            <div className="space-y-3">
              {selectedTweets.map((tweet) => (
                <div key={tweet.id}
                  className="rounded-xl border border-white/5 bg-dark-900/60 p-5 transition-all hover:border-white/10 hover:bg-dark-900/80">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark-800 text-lg">{tweet.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{tweet.name}</span>
                        {tweet.verified && <svg className="h-3.5 w-3.5 text-brand-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" /></svg>}
                        <span className="text-[11px] text-dark-500">{tweet.handle}</span>
                        <span className="text-[11px] text-dark-600">·</span>
                        <span className="text-[11px] text-dark-500">{tweet.timestamp}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-dark-200">{tweet.content}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tweet.topics.map((topic) => (
                          <span key={topic} className="rounded-md bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-400">#{topic}</span>
                        ))}
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getSentimentBg(tweet.sentiment)}`}>{tweet.sentiment}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-5 text-dark-500">
                        <span className="flex items-center gap-1.5 text-xs"><Heart size={14} /> {formatNumber(tweet.likes)}</span>
                        <span className="flex items-center gap-1.5 text-xs"><Repeat2 size={14} /> {formatNumber(tweet.retweets)}</span>
                        <span className="flex items-center gap-1.5 text-xs"><MessageCircle size={14} /> {formatNumber(tweet.replies)}</span>
                        <span className="flex items-center gap-1.5 text-xs"><Eye size={14} /> {formatNumber(tweet.views)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 rounded-xl border border-white/5 bg-dark-900/40">
              <Search size={32} className="text-dark-600 mb-3" />
              <p className="text-sm text-dark-400">No GenLayer-related posts found for this user</p>
            </div>
          )}
        </div>

        {/* Gas used notice */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-dark-400">Gas used for this lookup</span>
          <span className="text-xs font-medium text-amber-400">0.0015 GEN ≈ $0.00023</span>
        </div>

        <GasConfirmModal isOpen={showUserGas} action="lookup_profile"
          description={`Fetch posts about @GenLayer by ${pendingHandle}`}
          onConfirm={handleGasConfirmUser} onCancel={() => { setShowUserGas(false); setPendingHandle(null); }} />
      </div>
    );
  }

  // ══════════════════════════════
  // 5. User list (loaded)
  // ══════════════════════════════
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Find People on X</h1>
        <p className="mt-1 text-sm text-dark-400">
          {filtered.length} X users posting about{" "}
          <a href="https://x.com/GenLayer" target="_blank" rel="noopener noreferrer"
            className="text-brand-400 hover:underline inline-flex items-center gap-0.5">
            @GenLayer <ExternalLink size={10} />
          </a>
          {" "}— click any user to see their posts
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, handle, or topic..."
          className="w-full rounded-xl border border-white/10 bg-dark-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-dark-500 outline-none transition-all focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 backdrop-blur-sm" />
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((person) => {
          const ms = getMindshare(person.handle);
          const postCount = getUserTweets(person.handle).length;

          return (
            <button key={person.id} onClick={() => handleClickUser(person.handle)}
              className="group relative text-left overflow-hidden rounded-xl border border-white/5 bg-dark-900/60 p-5 backdrop-blur-sm transition-all hover:border-brand-500/30 hover:bg-dark-900/80">

              {/* Mindshare badge */}
              {ms && (
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                  {ms.rank <= 3 && <Crown size={10} />}
                  #{ms.rank} • {ms.mindshare}%
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dark-700 to-dark-800 text-2xl ring-2 ring-white/5 group-hover:ring-brand-500/20 transition-all">
                  {person.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">{person.name}</h3>
                  <p className="text-xs text-brand-400">{person.handle}</p>
                  <p className="mt-1 text-xs text-dark-400">{person.role}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{formatNumber(person.followers)}</p>
                  <p className="text-[10px] text-dark-500">Followers</p>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{postCount}</p>
                  <p className="text-[10px] text-dark-500">GL Posts</p>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{person.influence}</p>
                  <p className="text-[10px] text-dark-500">Influence</p>
                </div>
              </div>

              {/* Influence bar */}
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all"
                    style={{ width: `${person.influence}%` }} />
                </div>
              </div>

              {/* Topics */}
              <div className="mt-3 flex flex-wrap gap-1">
                {person.topics.map((topic) => (
                  <span key={topic} className="rounded-md bg-dark-800 px-2 py-0.5 text-[10px] font-medium text-dark-300">{topic}</span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-dark-500 flex items-center gap-1">
                  <Zap size={10} className="text-amber-400" /> 0.0015 GEN
                </span>
                <span className="text-[10px] text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  View GenLayer posts →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-16">
          <Search size={40} className="text-dark-600" />
          <p className="mt-4 text-sm text-dark-400">No users match "{query}"</p>
          <button onClick={() => setQuery("")} className="mt-2 text-xs text-brand-400 hover:underline">Clear search</button>
        </div>
      )}

      <GasConfirmModal isOpen={showUserGas} action="lookup_profile"
        description={`Fetch posts about @GenLayer by ${pendingHandle}`}
        onConfirm={handleGasConfirmUser} onCancel={() => { setShowUserGas(false); setPendingHandle(null); }} />
    </div>
  );
}
