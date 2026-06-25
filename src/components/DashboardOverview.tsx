import { TrendingUp, Users, MessageSquare, Eye, ArrowUpRight, ArrowDownRight, ExternalLink, Fuel } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { sentimentTimeline, topicTrends } from "../data/mockData";
import { formatNumber } from "../utils/format";
import { getNetworkStatusSync } from "../services/genlayer";

const stats = [
  { label: "Total Impressions", value: "12.4M", change: "+28.5%", up: true, icon: <Eye size={20} />, color: "from-brand-500 to-brand-700" },
  { label: "Engagement Rate", value: "7.8%", change: "+1.2%", up: true, icon: <TrendingUp size={20} />, color: "from-emerald-500 to-emerald-700" },
  { label: "Ecosystem Followers", value: "55K", change: "+18.4%", up: true, icon: <Users size={20} />, color: "from-cyan-500 to-cyan-700" },
  { label: "Mentions Today", value: "2.4K", change: "-3.1%", up: false, icon: <MessageSquare size={20} />, color: "from-amber-500 to-amber-700" },
];

const pieData = [
  { name: "Positive", value: 76, color: "#34d399" },
  { name: "Neutral", value: 16, color: "#fbbf24" },
  { name: "Negative", value: 8, color: "#fb7185" },
];

// Gas fees for each action
const gasFees = [
  { action: "Search Posts", gas: "0.0012 GEN", usd: "$0.00018" },
  { action: "Find People", gas: "0.0008 GEN", usd: "$0.00012" },
  { action: "Profile Lookup", gas: "0.0015 GEN", usd: "$0.00023" },
  { action: "Load Timeline", gas: "0.0020 GEN", usd: "$0.00030" },
  { action: "Sentiment Analysis", gas: "0.0035 GEN", usd: "$0.00053" },
  { action: "Mindshare Rankings", gas: "0.0042 GEN", usd: "$0.00063" },
];

export default function DashboardOverview() {
  const network = getNetworkStatusSync();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-dark-400">GenLayer social intelligence insights — verified on-chain</p>
        </div>
        <a
          href="https://studio.genlayer.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-xs font-medium text-violet-400 transition-all hover:bg-violet-500/10"
        >
          <span className="text-base">🧬</span> GenLayer Studio <ExternalLink size={10} />
        </a>
      </div>

      {/* Network Status Bar */}
      <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-dark-900/40 px-5 py-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">{network.network}</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-[10px] text-dark-500">Chain ID: <span className="text-dark-300">{network.chainId}</span></span>
        <span className="text-[10px] text-dark-500">Block: <span className="text-dark-300">#{network.blockHeight}</span></span>
        <span className="text-[10px] text-dark-500">Validators: <span className="text-dark-300">{network.validators}</span></span>
        <span className="text-[10px] text-dark-500">Latency: <span className="text-dark-300">{network.latency}</span></span>
      </div>

      {/* Gas Fees Card */}
      <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Fuel size={18} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Gas Fees (GenLayer Bradbury Testnet)</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gasFees.map((fee) => (
            <div key={fee.action} className="rounded-lg border border-white/5 bg-dark-900/40 p-3">
              <p className="text-[10px] text-dark-400 mb-1">{fee.action}</p>
              <p className="text-sm font-bold text-amber-400">{fee.gas}</p>
              <p className="text-[9px] text-dark-500">{fee.usd}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-dark-500">
          * Gas prices estimated at $0.15/GEN. Get testnet GEN from{" "}
          <a href="https://faucet.genlayer.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
            GenLayer Faucet
          </a>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group rounded-xl border border-white/5 bg-dark-900/60 p-5 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-dark-900/80">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                {s.icon}
              </div>
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.up ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {s.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-dark-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white">GenLayer Sentiment Over Time</h3>
          <p className="mb-4 text-xs text-dark-400">Monthly breakdown of @GenLayer community sentiment</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={sentimentTimeline}>
              <defs>
                <linearGradient id="gPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="positive" stroke="#34d399" fill="url(#gPositive)" strokeWidth={2} />
              <Area type="monotone" dataKey="neutral" stroke="#fbbf24" fill="url(#gNeutral)" strokeWidth={2} />
              <Area type="monotone" dataKey="negative" stroke="#fb7185" fill="url(#gNegative)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white">Overall Sentiment</h3>
          <p className="mb-4 text-xs text-dark-400">Current @GenLayer community mood</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs text-dark-300">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                {p.name} ({p.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Trending GenLayer Topics</h3>
            <p className="text-xs text-dark-400">Real-time topic volume and sentiment in the ecosystem</p>
          </div>
          <a
            href="https://x.com/GenLayer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-brand-400 hover:underline"
          >
            @GenLayer <ExternalLink size={10} />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topicTrends.map((t) => (
            <div key={t.topic} className="flex items-center justify-between rounded-lg border border-white/5 bg-dark-800/50 px-4 py-3">
              <div>
                <span className="text-sm font-semibold text-white">#{t.topic}</span>
                <p className="text-xs text-dark-400">{formatNumber(t.volume)} mentions</p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${t.change > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {t.change > 0 ? "+" : ""}{t.change}%
                </span>
                <div className="mt-0.5 flex items-center justify-end gap-1">
                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-dark-700">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${t.sentiment}%`,
                        background: t.sentiment >= 70 ? "#34d399" : t.sentiment >= 50 ? "#fbbf24" : "#fb7185",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-dark-500">{t.sentiment}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
