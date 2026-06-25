import { useState, useMemo, useCallback } from "react";
import {
  MapPin, Link2, Calendar, ChevronRight, Zap, Heart, Repeat2,
  MessageCircle, Eye, Award, Crown,
  BarChart3, User, LogOut, Loader2, ArrowLeft,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { twitterProfiles, tweets, mindshareRankings } from "../data/mockData";
import { formatNumber, getSentimentBg, getTrendColor } from "../utils/format";
import { getStoredXProfile, connectXProfile, disconnectXProfile, getMyMindshare } from "../services/xProfile";
import type { XProfile } from "../services/xProfile";
import GasConfirmModal from "./GasConfirmModal";
import type { TwitterProfile } from "../data/mockData";

// helpers
function getMindshare(handle: string) {
  return mindshareRankings.find((m) => m.handle.toLowerCase() === handle.toLowerCase()) || null;
}
function getUserTweets(handle: string) {
  return tweets.filter((t) => t.handle.toLowerCase() === handle.toLowerCase());
}

export default function TwitterProfiles() {
  const [tab, setTab] = useState<"my" | "explore">("my");
  const [xProfile, setXProfile] = useState<XProfile | null>(getStoredXProfile());
  const [xHandleInput, setXHandleInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // My profile gas
  const [showMyGas, setShowMyGas] = useState(false);
  const [myLoaded, setMyLoaded] = useState(false);
  const [myLoading, setMyLoading] = useState(false);

  // Explore
  const [selectedProfile, setSelectedProfile] = useState<TwitterProfile | null>(null);
  const [showExploreGas, setShowExploreGas] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<TwitterProfile | null>(null);
  const [exploreLoading, setExploreLoading] = useState(false);

  // ── My Profile data ──
  const myMindshare = xProfile ? getMyMindshare(xProfile.handle) : null;

  // Simulate: user's posts about GenLayer (pick random subset)
  const myPosts = useMemo(() => {
    if (!xProfile) return [];
    // In production: fetch from on-chain. Here we simulate posts.
    const seed = xProfile.handle.length;
    return [
      {
        id: "my1", content: `Just explored @GenLayer's Intelligent Contracts — the Python-based smart contracts + LLM integration is incredible. GenVM is the future of Web3 🧬`, timestamp: "3h ago",
        likes: 120 + seed * 5, retweets: 34 + seed * 2, replies: 12 + seed, views: 4200 + seed * 100,
        sentiment: "positive" as const, topics: ["GenLayer", "IntelligentContracts"],
      },
      {
        id: "my2", content: `Running through @GenLayer Testnet Bradbury. Staking is smooth, gas fees are minimal. The validator experience is well-thought-out. Bullish on this ecosystem.`, timestamp: "1d ago",
        likes: 89 + seed * 3, retweets: 22 + seed, replies: 8 + seed, views: 3100 + seed * 80,
        sentiment: "positive" as const, topics: ["GenLayer", "Testnet", "Staking"],
      },
      {
        id: "my3", content: `Interesting take on Optimistic Democracy Consensus by @GenLayer. Validators don't need identical outputs, just 'equivalent enough'. Opens the door to non-deterministic on-chain compute.`, timestamp: "3d ago",
        likes: 56 + seed * 2, retweets: 18 + seed, replies: 6, views: 2400 + seed * 60,
        sentiment: "neutral" as const, topics: ["GenLayer", "Consensus", "AI"],
      },
      {
        id: "my4", content: `Some concerns about the gas costs on @GenLayer testnet when deploying complex Intelligent Contracts. Hope they optimize this before mainnet. The tech is great but affordability matters.`, timestamp: "5d ago",
        likes: 32 + seed, retweets: 8, replies: 14 + seed, views: 1800 + seed * 40,
        sentiment: "negative" as const, topics: ["GenLayer", "Gas", "Feedback"],
      },
    ];
  }, [xProfile]);

  const mySentiment = useMemo(() => {
    const pos = myPosts.filter((p) => p.sentiment === "positive").length;
    const neu = myPosts.filter((p) => p.sentiment === "neutral").length;
    const neg = myPosts.filter((p) => p.sentiment === "negative").length;
    const total = myPosts.length || 1;
    return {
      positive: Math.round((pos / total) * 100),
      neutral: Math.round((neu / total) * 100),
      negative: Math.round((neg / total) * 100),
      engagement: myPosts.reduce((s, p) => s + p.likes + p.retweets + p.replies, 0),
      views: myPosts.reduce((s, p) => s + p.views, 0),
    };
  }, [myPosts]);

  // ── Handlers ──
  const handleConnectX = useCallback(() => {
    if (!xHandleInput.trim()) return;
    setIsConnecting(true);
    setTimeout(() => {
      const profile = connectXProfile(xHandleInput.trim());
      setXProfile(profile);
      setXHandleInput("");
      setIsConnecting(false);
    }, 800);
  }, [xHandleInput]);

  const handleDisconnectX = () => {
    disconnectXProfile();
    setXProfile(null);
    setMyLoaded(false);
  };

  const handleLoadMyProfile = () => setShowMyGas(true);
  const handleMyGasConfirm = () => {
    setShowMyGas(false);
    setMyLoading(true);
    setTimeout(() => { setMyLoaded(true); setMyLoading(false); }, 1800);
  };

  const handleClickExplore = (profile: TwitterProfile) => {
    setPendingProfile(profile);
    setShowExploreGas(true);
  };
  const handleExploreGasConfirm = () => {
    setShowExploreGas(false);
    setExploreLoading(true);
    setTimeout(() => { setSelectedProfile(pendingProfile); setPendingProfile(null); setExploreLoading(false); }, 1500);
  };

  // ── Explore detail data ──
  const exploreTweets = selectedProfile ? getUserTweets(selectedProfile.handle) : [];
  const exploreMindshare = selectedProfile ? getMindshare(selectedProfile.handle) : null;
  const exploreSentiment = useMemo(() => {
    const pos = exploreTweets.filter((t) => t.sentiment === "positive").length;
    const neu = exploreTweets.filter((t) => t.sentiment === "neutral").length;
    const neg = exploreTweets.filter((t) => t.sentiment === "negative").length;
    const total = exploreTweets.length || 1;
    return { positive: Math.round((pos / total) * 100), neutral: Math.round((neu / total) * 100), negative: Math.round((neg / total) * 100) };
  }, [exploreTweets]);

  // ══════════════════════════════
  //  RENDER
  // ══════════════════════════════
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profiles</h1>
          <p className="mt-1 text-sm text-dark-400">View your profile or explore @GenLayer ecosystem accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-dark-900/60 p-1 w-fit">
        <button onClick={() => { setTab("my"); setSelectedProfile(null); }}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-all ${tab === "my" ? "bg-brand-600/20 text-brand-400" : "text-dark-400 hover:text-dark-200"}`}>
          <User size={14} /> My Profile
        </button>
        <button onClick={() => setTab("explore")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-all ${tab === "explore" ? "bg-brand-600/20 text-brand-400" : "text-dark-400 hover:text-dark-200"}`}>
          <ChevronRight size={14} /> Explore
        </button>
      </div>

      {/* ═══════════════════════════════ */}
      {/*  MY PROFILE TAB                */}
      {/* ═══════════════════════════════ */}
      {tab === "my" && (
        <>
          {/* Not connected */}
          {!xProfile && (
            <div className="space-y-6">
              <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-brand-500/5 p-6 text-center">
                <div className="text-5xl mb-4">𝕏</div>
                <h3 className="text-lg font-bold text-white mb-2">Connect Your X Account</h3>
                <p className="text-sm text-dark-400 mb-6 max-w-md mx-auto">
                  Link your X (Twitter) account to see your posts about <strong className="text-brand-400">@GenLayer</strong>, your mindshare score, sentiment analysis, and engagement stats.
                </p>
                <div className="max-w-sm mx-auto space-y-3">
                  <input
                    type="text" value={xHandleInput} onChange={(e) => setXHandleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConnectX()}
                    placeholder="Enter your X handle (e.g. @yourname)"
                    className="w-full rounded-xl border border-white/10 bg-dark-800/50 px-4 py-3 text-sm text-white text-center placeholder-dark-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20" />
                  <button onClick={handleConnectX} disabled={!xHandleInput.trim() || isConnecting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 disabled:opacity-40 transition-all">
                    {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
                    {isConnecting ? "Connecting..." : "Connect X Account"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Connected but not loaded yet */}
          {xProfile && !myLoaded && !myLoading && (
            <div className="space-y-6">
              {/* Connected badge */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-800 text-2xl ring-2 ring-emerald-500/20">{xProfile.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{xProfile.name}</p>
                    <p className="text-xs text-emerald-400">{xProfile.handle} connected</p>
                  </div>
                </div>
                <button onClick={handleDisconnectX} className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 transition-colors">
                  <LogOut size={10} /> Disconnect
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10"><Zap size={20} className="text-amber-400" /></div>
                  <div>
                    <p className="text-sm font-medium text-white">Gas Required</p>
                    <p className="text-xs text-dark-400">Fetch your @GenLayer posts & mindshare</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-400">0.0015 GEN</p>
                  <p className="text-[10px] text-dark-500">≈ $0.00023 USD</p>
                </div>
              </div>

              <button onClick={handleLoadMyProfile}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all">
                <Zap size={16} /> Sign & Load My GenLayer Profile
              </button>
            </div>
          )}

          {/* Loading */}
          {xProfile && myLoading && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
              <Loader2 size={48} className="text-brand-400 animate-spin mb-4" />
              <h3 className="text-white font-semibold mb-2">Fetching Your Profile...</h3>
              <p className="text-xs text-dark-400">Scanning your posts about @GenLayer • Gas: 0.0015 GEN</p>
            </div>
          )}

          {/* Loaded - full profile view */}
          {xProfile && myLoaded && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="rounded-xl border border-white/5 bg-dark-900/60 overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-brand-700 to-violet-900" />
                <div className="px-6 pb-6 -mt-10">
                  <div className="flex items-end justify-between">
                    <div className="flex items-end gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-dark-900 bg-dark-800 text-4xl">{xProfile.avatar}</div>
                      <div className="mb-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-white">{xProfile.name}</h2>
                          {xProfile.verified && <svg className="h-5 w-5 text-brand-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" /></svg>}
                        </div>
                        <p className="text-sm text-brand-400">{xProfile.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {myMindshare && (
                        <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                          <Award size={14} className="text-amber-400" />
                          <div className="text-right">
                            <p className="text-xs font-bold text-amber-400">#{myMindshare.rank} Mindshare</p>
                            <p className="text-[10px] text-dark-400">{myMindshare.score}%</p>
                          </div>
                        </div>
                      )}
                      <button onClick={handleDisconnectX} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-dark-400 hover:text-rose-400 hover:border-rose-500/20 transition-colors">
                        <LogOut size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-dark-200">{xProfile.bio}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-dark-400">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {xProfile.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Joined {xProfile.joinDate}</span>
                  </div>
                  <div className="mt-4 flex gap-6 border-t border-white/5 pt-4">
                    <div><span className="text-lg font-bold text-white">{formatNumber(xProfile.followers)}</span><span className="ml-1 text-xs text-dark-500">Followers</span></div>
                    <div><span className="text-lg font-bold text-white">{xProfile.following}</span><span className="ml-1 text-xs text-dark-500">Following</span></div>
                    <div><span className="text-lg font-bold text-white">{myPosts.length}</span><span className="ml-1 text-xs text-dark-500">GL Posts</span></div>
                  </div>
                </div>
              </div>

              {/* Mindshare + Sentiment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mindshare */}
                <div className="rounded-xl border border-white/5 bg-dark-900/60 p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Award size={14} className="text-amber-400" /> Your Mindshare</h3>
                  {myMindshare && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-dark-800/50 p-3 text-center">
                          <p className="text-xl font-bold text-white">#{myMindshare.rank}</p>
                          <p className="text-[10px] text-dark-500">Rank / {myMindshare.totalParticipants}</p>
                        </div>
                        <div className="rounded-lg bg-dark-800/50 p-3 text-center">
                          <p className="text-xl font-bold text-amber-400">{myMindshare.score}%</p>
                          <p className="text-[10px] text-dark-500">Mindshare</p>
                        </div>
                        <div className="rounded-lg bg-dark-800/50 p-3 text-center">
                          <p className={`text-xl font-bold ${getTrendColor(myMindshare.change)}`}>
                            {myMindshare.change > 0 ? "+" : ""}{myMindshare.change}%
                          </p>
                          <p className="text-[10px] text-dark-500">Change</p>
                        </div>
                        <div className="rounded-lg bg-dark-800/50 p-3 text-center">
                          <p className="text-xl font-bold text-white">{formatNumber(myMindshare.mentions)}</p>
                          <p className="text-[10px] text-dark-500">Mentions</p>
                        </div>
                      </div>
                      {/* Weekly trend */}
                      <div className="pt-2">
                        <p className="text-[10px] text-dark-500 mb-2">Weekly Trend</p>
                        <ResponsiveContainer width="100%" height={100}>
                          <AreaChart data={myMindshare.weeklyTrend}>
                            <defs><linearGradient id="gMyMS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} /><stop offset="95%" stopColor="#818cf8" stopOpacity={0} /></linearGradient></defs>
                            <XAxis dataKey="week" tick={{ fill: "#475569", fontSize: 9 }} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "10px", color: "#e2e8f0" }} />
                            <Area type="monotone" dataKey="score" stroke="#818cf8" fill="url(#gMyMS)" strokeWidth={2} dot={{ r: 2, fill: "#818cf8" }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {myMindshare.topTopics.map((t) => (
                          <span key={t} className="rounded-full bg-brand-600/10 px-2.5 py-0.5 text-[10px] text-brand-400 border border-brand-500/20">#{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sentiment */}
                <div className="rounded-xl border border-white/5 bg-dark-900/60 p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 size={14} className="text-brand-400" /> Post Sentiment</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-dark-800/50 p-3 text-center">
                        <p className="text-xl font-bold text-white">{myPosts.length}</p>
                        <p className="text-[10px] text-dark-500">GL Posts</p>
                      </div>
                      <div className="rounded-lg bg-dark-800/50 p-3 text-center">
                        <p className="text-xl font-bold text-white">{formatNumber(mySentiment.engagement)}</p>
                        <p className="text-[10px] text-dark-500">Engagement</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      {([["Positive", mySentiment.positive, "bg-emerald-400", "text-emerald-400"], ["Neutral", mySentiment.neutral, "bg-amber-400", "text-amber-400"], ["Negative", mySentiment.negative, "bg-rose-400", "text-rose-400"]] as const).map(([label, val, bg, text]) => (
                        <div key={label}>
                          <div className="flex items-center justify-between text-[10px] mb-1"><span className={text}>{label}</span><span className="text-dark-400">{val}%</span></div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800"><div className={`h-full rounded-full ${bg}`} style={{ width: `${val}%` }} /></div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 text-center">
                      <p className="text-[10px] text-dark-500">{formatNumber(mySentiment.views)} total views</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Posts */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Your Posts About @GenLayer ({myPosts.length})</h3>
                <div className="space-y-3">
                  {myPosts.map((post) => (
                    <div key={post.id} className="rounded-xl border border-white/5 bg-dark-900/60 p-5 hover:border-white/10 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark-800 text-lg">{xProfile.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{xProfile.name}</span>
                            <span className="text-[11px] text-dark-500">{xProfile.handle}</span>
                            <span className="text-[11px] text-dark-600">·</span>
                            <span className="text-[11px] text-dark-500">{post.timestamp}</span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-dark-200">{post.content}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {post.topics.map((t) => (<span key={t} className="rounded-md bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-400">#{t}</span>))}
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getSentimentBg(post.sentiment)}`}>{post.sentiment}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-5 text-dark-500">
                            <span className="flex items-center gap-1.5 text-xs"><Heart size={14} /> {formatNumber(post.likes)}</span>
                            <span className="flex items-center gap-1.5 text-xs"><Repeat2 size={14} /> {formatNumber(post.retweets)}</span>
                            <span className="flex items-center gap-1.5 text-xs"><MessageCircle size={14} /> {formatNumber(post.replies)}</span>
                            <span className="flex items-center gap-1.5 text-xs"><Eye size={14} /> {formatNumber(post.views)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gas notice */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-dark-400">Gas used</span>
                <span className="text-xs font-medium text-amber-400">0.0015 GEN ≈ $0.00023</span>
              </div>
            </div>
          )}

          <GasConfirmModal isOpen={showMyGas} action="lookup_profile"
            description={`Fetch your @GenLayer posts & mindshare for ${xProfile?.handle || ""}`}
            onConfirm={handleMyGasConfirm} onCancel={() => setShowMyGas(false)} />
        </>
      )}

      {/* ═══════════════════════════════ */}
      {/*  EXPLORE TAB                    */}
      {/* ═══════════════════════════════ */}
      {tab === "explore" && !selectedProfile && !exploreLoading && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {twitterProfiles.map((profile) => {
              const ms = getMindshare(profile.handle);
              const postCount = getUserTweets(profile.handle).length;
              return (
                <button key={profile.id} onClick={() => handleClickExplore(profile)}
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-dark-900/60 text-left backdrop-blur-sm transition-all hover:border-brand-500/30 hover:bg-dark-900/80">
                  <div className={`h-20 bg-gradient-to-r ${profile.bannerColor}`} />
                  <div className="relative px-5 pb-5">
                    <div className="-mt-8 mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-dark-900 bg-dark-800 text-3xl">{profile.avatar}</div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors">{profile.name}</h3>
                          {profile.verified && <svg className="h-4 w-4 text-brand-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" /></svg>}
                        </div>
                        <p className="text-xs text-dark-400">{profile.handle}</p>
                      </div>
                      {ms && <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">{ms.rank <= 3 && <Crown size={10} />}#{ms.rank}</span>}
                    </div>
                    <p className="mt-2 text-xs text-dark-300 line-clamp-2">{profile.bio}</p>
                    <div className="mt-3 flex gap-4 text-[10px]">
                      <span><strong className="text-white text-xs">{formatNumber(profile.followers)}</strong> <span className="text-dark-500">Followers</span></span>
                      <span><strong className="text-white text-xs">{postCount}</strong> <span className="text-dark-500">GL Posts</span></span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-dark-500 flex items-center gap-1"><Zap size={10} className="text-amber-400" /> 0.0015 GEN</span>
                      <span className="text-[10px] text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">View posts →</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <GasConfirmModal isOpen={showExploreGas} action="lookup_profile"
            description={`Fetch @GenLayer posts by ${pendingProfile?.handle || ""}`}
            onConfirm={handleExploreGasConfirm} onCancel={() => { setShowExploreGas(false); setPendingProfile(null); }} />
        </>
      )}

      {/* Explore loading */}
      {tab === "explore" && exploreLoading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <Loader2 size={48} className="text-brand-400 animate-spin mb-4" />
          <h3 className="text-white font-semibold mb-2">Loading {pendingProfile?.name}'s Posts...</h3>
          <p className="text-xs text-dark-400">Gas: 0.0015 GEN</p>
        </div>
      )}

      {/* Explore detail */}
      {tab === "explore" && selectedProfile && !exploreLoading && (
        <div className="space-y-6">
          <button onClick={() => setSelectedProfile(null)} className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-brand-400 transition-colors"><ArrowLeft size={14} /> Back to explore</button>
          {/* Header */}
          <div className="rounded-xl border border-white/5 bg-dark-900/60 overflow-hidden">
            <div className={`h-28 bg-gradient-to-r ${selectedProfile.bannerColor}`} />
            <div className="px-6 pb-6 -mt-10">
              <div className="flex items-end justify-between">
                <div className="flex items-end gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-dark-900 bg-dark-800 text-4xl">{selectedProfile.avatar}</div>
                  <div className="mb-1">
                    <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-white">{selectedProfile.name}</h2>
                      {selectedProfile.verified && <svg className="h-5 w-5 text-brand-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" /></svg>}
                    </div>
                    <p className="text-sm text-dark-400">{selectedProfile.handle}</p>
                  </div>
                </div>
                {exploreMindshare && (
                  <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                    {exploreMindshare.rank <= 3 && <Crown size={14} className="text-amber-400" />}
                    <div className="text-right">
                      <p className="text-xs font-bold text-amber-400">#{exploreMindshare.rank} Mindshare</p>
                      <p className="text-[10px] text-dark-400">{exploreMindshare.mindshare}%</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-dark-200">{selectedProfile.bio}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-dark-400">
                <span className="flex items-center gap-1"><MapPin size={12} /> {selectedProfile.location}</span>
                <span className="flex items-center gap-1"><Link2 size={12} /> {selectedProfile.website}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined {selectedProfile.joinDate}</span>
              </div>
              <div className="mt-4 flex gap-6 border-t border-white/5 pt-4">
                <div><span className="text-lg font-bold text-white">{formatNumber(selectedProfile.followers)}</span><span className="ml-1 text-xs text-dark-500">Followers</span></div>
                <div><span className="text-lg font-bold text-white">{formatNumber(selectedProfile.following)}</span><span className="ml-1 text-xs text-dark-500">Following</span></div>
                <div><span className="text-lg font-bold text-white">{exploreTweets.length}</span><span className="ml-1 text-xs text-dark-500">GL Posts</span></div>
              </div>
            </div>
          </div>

          {/* Mindshare + Sentiment mini */}
          {exploreMindshare && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-white/5 bg-dark-900/40 p-3 text-center">
                <p className="text-lg font-bold text-amber-400">{exploreMindshare.mindshare}%</p><p className="text-[10px] text-dark-500">Mindshare</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-dark-900/40 p-3 text-center">
                <p className={`text-lg font-bold ${getTrendColor(exploreMindshare.change)}`}>{exploreMindshare.change > 0 ? "+" : ""}{exploreMindshare.change}%</p><p className="text-[10px] text-dark-500">Change</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-dark-900/40 p-3 text-center">
                <p className="text-lg font-bold text-emerald-400">{exploreSentiment.positive}%</p><p className="text-[10px] text-dark-500">Positive</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-dark-900/40 p-3 text-center">
                <p className="text-lg font-bold text-white">{formatNumber(exploreMindshare.mentions)}</p><p className="text-[10px] text-dark-500">Mentions</p>
              </div>
            </div>
          )}

          {/* Posts */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{selectedProfile.name}'s Posts About @GenLayer ({exploreTweets.length})</h3>
            {exploreTweets.length > 0 ? (
              <div className="space-y-3">
                {exploreTweets.map((tweet) => (
                  <div key={tweet.id} className="rounded-xl border border-white/5 bg-dark-900/60 p-5 hover:border-white/10 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark-800 text-lg">{tweet.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{tweet.name}</span>
                          {tweet.verified && <svg className="h-3.5 w-3.5 text-brand-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" /></svg>}
                          <span className="text-[11px] text-dark-500">{tweet.handle} · {tweet.timestamp}</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-dark-200">{tweet.content}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {tweet.topics.map((t) => (<span key={t} className="rounded-md bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-400">#{t}</span>))}
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
                <p className="text-sm text-dark-400">No GenLayer posts found</p>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-dark-400">Gas used</span>
            <span className="text-xs font-medium text-amber-400">0.0015 GEN ≈ $0.00023</span>
          </div>
        </div>
      )}
    </div>
  );
}
