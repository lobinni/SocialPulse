import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Crown, TrendingUp, TrendingDown, Minus, ExternalLink, User, Zap, AlertCircle, Loader2 } from "lucide-react";
import { mindshareRankings } from "../data/mockData";
import { formatNumber, getTrendColor } from "../utils/format";
import { getStoredXProfile, getMyMindshare } from "../services/xProfile";
import GasConfirmModal from "./GasConfirmModal";

export default function MindshareRankings() {
  const [view, setView] = useState<"table" | "chart" | "my">("table");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);
  
  const xProfile = getStoredXProfile();
  const myMindshare = xProfile ? getMyMindshare(xProfile.handle) : null;

  const chartData = mindshareRankings.map((m) => ({
    name: m.name.split(" ").slice(0, 2).join(" "),
    mindshare: m.mindshare,
    sentiment: m.sentiment,
  }));

  const handleLoadRankings = () => {
    setShowGasModal(true);
  };

  const handleGasConfirm = () => {
    setShowGasModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setHasLoaded(true);
      setIsLoading(false);
    }, 2000);
  };

  // Initial state - require gas to load
  if (!hasLoaded && !isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Mindshare Rankings</h1>
          <p className="mt-1 text-sm text-dark-400">
            Who dominates the GenLayer conversation? Based on{" "}
            <a href="https://x.com/GenLayer" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline inline-flex items-center gap-0.5">
              @GenLayer <ExternalLink size={10} />
            </a>
          </p>
        </div>

        {/* Explanation Card */}
        <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-brand-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-violet-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">How Mindshare is Calculated</h4>
              <p className="text-xs text-dark-400 leading-relaxed mb-3">
                GenLayer's Intelligent Contracts analyze mentions, engagement, and sentiment around <strong className="text-violet-400">@GenLayer</strong> on X (Twitter). 
                Validators independently verify results using AI to ensure accurate rankings.
              </p>
              <ul className="text-xs text-dark-400 space-y-1">
                <li>• <span className="text-dark-300">Mentions:</span> How often the account is mentioned with @GenLayer</li>
                <li>• <span className="text-dark-300">Engagement:</span> Likes, retweets, and replies on GenLayer-related posts</li>
                <li>• <span className="text-dark-300">Sentiment:</span> AI-analyzed positive/negative sentiment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gas Fee Info */}
        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Zap size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Gas Required to Load Rankings</p>
              <p className="text-xs text-dark-400">Fetch and verify mindshare data from X</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-amber-400">0.0042 GEN</p>
            <p className="text-[10px] text-dark-500">≈ $0.00063 USD</p>
          </div>
        </div>

        {/* Load Button */}
        <button
          onClick={handleLoadRankings}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all"
        >
          <Zap size={16} />
          Sign & Load Mindshare Rankings
        </button>

        <GasConfirmModal
          isOpen={showGasModal}
          action="rank_mindshare"
          description="Fetch and analyze @GenLayer mindshare rankings from X"
          onConfirm={handleGasConfirm}
          onCancel={() => setShowGasModal(false)}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Mindshare Rankings</h1>
          <p className="mt-1 text-sm text-dark-400">Loading @GenLayer ecosystem rankings...</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <Loader2 size={48} className="text-brand-400 animate-spin mb-4" />
          <h3 className="text-white font-semibold mb-2">Analyzing Mindshare...</h3>
          <p className="text-xs text-dark-400 mb-4">GenLayer validators are fetching data from X</p>
          <div className="flex items-center gap-2 text-[10px] text-dark-500">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Consensus in progress • Gas: 0.0042 GEN</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mindshare Rankings</h1>
          <p className="mt-1 text-sm text-dark-400">
            Who dominates the GenLayer conversation? Based on{" "}
            <a href="https://x.com/GenLayer" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline inline-flex items-center gap-0.5">
              @GenLayer <ExternalLink size={10} />
            </a>
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-dark-900/60 p-1">
          {(["table", "chart", ...(xProfile ? ["my"] as const : [])] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v as typeof view)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                view === v ? "bg-brand-600/20 text-brand-400" : "text-dark-400 hover:text-dark-200"
              }`}
            >
              {v === "my" ? "My Mindshare" : v}
            </button>
          ))}
        </div>
      </div>

      {/* GenLayer Project Link Banner */}
      <a
        href="https://x.com/GenLayer"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-brand-500/5 px-5 py-3 transition-all hover:border-violet-500/30 hover:from-violet-500/10"
      >
        <span className="text-2xl">🧬</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">GenLayer Ecosystem Mindshare</p>
          <p className="text-[10px] text-dark-400">Rankings verified on-chain • Gas used: 0.0042 GEN</p>
        </div>
        <ExternalLink size={16} className="text-dark-500" />
      </a>

      {view === "table" && (
        <div className="rounded-xl border border-white/5 bg-dark-900/60 backdrop-blur-sm overflow-hidden">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 border-b border-white/5 p-6">
            {mindshareRankings.slice(0, 3).map((m, idx) => (
              <div
                key={m.rank}
                className={`relative flex flex-col items-center rounded-xl border p-5 text-center ${
                  idx === 0
                    ? "border-amber-500/20 bg-amber-500/5"
                    : idx === 1
                    ? "border-dark-600/30 bg-dark-800/30"
                    : "border-orange-900/20 bg-orange-900/5"
                }`}
              >
                <div className={`mb-2 text-lg ${idx === 0 ? "text-amber-400" : idx === 1 ? "text-dark-400" : "text-orange-600"}`}>
                  {idx === 0 ? <Crown size={24} /> : `#${m.rank}`}
                </div>
                <div className="text-3xl mb-2">{m.avatar}</div>
                <h3 className="text-sm font-bold text-white">{m.name}</h3>
                <p className="text-[10px] text-dark-500">{m.handle}</p>
                <p className="mt-2 text-2xl font-bold text-white">{m.mindshare}%</p>
                <p className="text-[10px] text-dark-500">mindshare</p>
                <span className={`mt-2 flex items-center gap-0.5 text-[11px] font-medium ${getTrendColor(m.change)}`}>
                  {m.change > 0 ? <TrendingUp size={11} /> : m.change < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
                  {m.change > 0 ? "+" : ""}{m.change}%
                </span>
              </div>
            ))}
          </div>

          {/* Full Table */}
          <div className="p-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-dark-500">
                  <th className="pb-3 pr-4 font-medium w-12">#</th>
                  <th className="pb-3 pr-4 font-medium">Account</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium text-right">Mindshare</th>
                  <th className="pb-3 pr-4 font-medium text-right">Change</th>
                  <th className="pb-3 pr-4 font-medium text-right">Mentions</th>
                  <th className="pb-3 font-medium text-right">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {mindshareRankings.map((m) => (
                  <tr key={m.rank} className="border-b border-white/5 last:border-0 hover:bg-white/[.02] transition-colors">
                    <td className="py-3 pr-4">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        m.rank === 1 ? "bg-amber-500/20 text-amber-400" :
                        m.rank === 2 ? "bg-dark-600/30 text-dark-300" :
                        m.rank === 3 ? "bg-orange-900/20 text-orange-500" :
                        "bg-dark-800 text-dark-500"
                      }`}>
                        {m.rank}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{m.avatar}</span>
                        <div>
                          <p className="font-semibold text-white">{m.name}</p>
                          <p className="text-[10px] text-dark-500">{m.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-md bg-dark-800 px-2 py-0.5 text-[10px] font-medium text-dark-300">{m.category}</span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-dark-800">
                          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(m.mindshare / mindshareRankings[0].mindshare) * 100}%` }} />
                        </div>
                        <span className="font-semibold text-white">{m.mindshare}%</span>
                      </div>
                    </td>
                    <td className={`py-3 pr-4 text-right font-medium ${getTrendColor(m.change)}`}>
                      {m.change > 0 ? "+" : ""}{m.change}%
                    </td>
                    <td className="py-3 pr-4 text-right text-dark-300">{formatNumber(m.mentions)}</td>
                    <td className="py-3 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        m.sentiment >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                        m.sentiment >= 50 ? "bg-amber-500/10 text-amber-400" :
                        "bg-rose-500/10 text-rose-400"
                      }`}>
                        {m.sentiment}%
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Show user's own position if connected */}
                {xProfile && myMindshare && (
                  <tr className="border-t-2 border-brand-500/20 bg-brand-500/5">
                    <td className="py-3 pr-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-[10px] font-bold text-brand-400">
                        {myMindshare.rank}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-400">You ({xProfile.name})</p>
                          <p className="text-[10px] text-dark-500">{xProfile.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium text-brand-400">You</span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="font-semibold text-brand-400">{myMindshare.score}%</span>
                    </td>
                    <td className={`py-3 pr-4 text-right font-medium ${getTrendColor(myMindshare.change)}`}>
                      {myMindshare.change > 0 ? "+" : ""}{myMindshare.change}%
                    </td>
                    <td className="py-3 pr-4 text-right text-dark-300">{formatNumber(myMindshare.mentions)}</td>
                    <td className="py-3 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        myMindshare.sentiment >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                        myMindshare.sentiment >= 50 ? "bg-amber-500/10 text-amber-400" :
                        "bg-rose-500/10 text-rose-400"
                      }`}>
                        {myMindshare.sentiment}%
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "chart" && (
        <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-white">GenLayer Mindshare Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" barSize={20}>
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#e2e8f0", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
              <Bar dataKey="mindshare" fill="#818cf8" radius={[0, 6, 6, 0]} name="Mindshare %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === "my" && xProfile && myMindshare && (
        <div className="space-y-6">
          {/* My Mindshare Card */}
          <div className="rounded-xl border border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-violet-500/5 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/20 text-3xl ring-2 ring-brand-500/30">
                {xProfile.avatar}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{xProfile.name}</h2>
                <p className="text-sm text-brand-400">{xProfile.handle}</p>
                <p className="text-xs text-dark-400 mt-0.5">{xProfile.bio}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
                <p className="text-2xl font-bold text-white">{myMindshare.score}%</p>
                <p className="text-[10px] text-dark-500">Mindshare</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
                <p className="text-2xl font-bold text-white">#{myMindshare.rank}</p>
                <p className="text-[10px] text-dark-500">Rank / {myMindshare.totalParticipants}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
                <p className="text-2xl font-bold text-white">{formatNumber(myMindshare.mentions)}</p>
                <p className="text-[10px] text-dark-500">Mentions</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/40 p-4 text-center">
                <p className={`text-2xl font-bold ${getTrendColor(myMindshare.change)}`}>
                  {myMindshare.change > 0 ? "+" : ""}{myMindshare.change}%
                </p>
                <p className="text-[10px] text-dark-500">Change</p>
              </div>
            </div>
          </div>

          {/* My Mindshare Trend */}
          <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white mb-1">Your Mindshare Trend</h3>
            <p className="text-xs text-dark-400 mb-4">Weekly mindshare score in GenLayer ecosystem</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={myMindshare.weeklyTrend}>
                <defs>
                  <linearGradient id="gMyMindshare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="score" stroke="#818cf8" fill="url(#gMyMindshare)" strokeWidth={2.5} dot={{ r: 4, fill: "#818cf8" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Topics */}
          <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white mb-3">Your Top Topics</h3>
            <div className="flex flex-wrap gap-2">
              {myMindshare.topTopics.map((topic) => (
                <span key={topic} className="rounded-full bg-brand-600/10 px-4 py-1.5 text-xs font-medium text-brand-400 border border-brand-500/20">
                  #{topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "my" && !xProfile && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-16">
          <User size={40} className="text-dark-600 mb-4" />
          <h3 className="text-white font-semibold mb-1">Connect Your X Account</h3>
          <p className="text-xs text-dark-400 mb-4">Link your X profile to see your personal mindshare data</p>
          <p className="text-[10px] text-dark-500">Use the Account panel in the top-right corner</p>
        </div>
      )}
    </div>
  );
}
