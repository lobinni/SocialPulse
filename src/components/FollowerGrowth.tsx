import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Line, ComposedChart } from "recharts";
import { TrendingUp, UserPlus, UserMinus, Zap } from "lucide-react";
import { followerGrowth } from "../data/mockData";
import { formatNumber } from "../utils/format";
import GasConfirmModal from "./GasConfirmModal";

const latestData = followerGrowth[followerGrowth.length - 1];
const previousData = followerGrowth[followerGrowth.length - 2];
const totalGained = followerGrowth.reduce((sum, d) => sum + d.gained, 0);
const totalLost = followerGrowth.reduce((sum, d) => sum + d.lost, 0);
const avgEngagement = (followerGrowth.reduce((sum, d) => sum + d.engagementRate, 0) / followerGrowth.length).toFixed(1);
const growthRate = (((latestData.followers - followerGrowth[0].followers) / followerGrowth[0].followers) * 100).toFixed(1);

const stats = [
  { label: "@GenLayer Followers", value: formatNumber(latestData.followers), icon: <TrendingUp size={18} />, color: "from-brand-500 to-brand-700", sub: `+${growthRate}% growth` },
  { label: "Total Gained (12w)", value: formatNumber(totalGained), icon: <UserPlus size={18} />, color: "from-emerald-500 to-emerald-700", sub: `~${formatNumber(Math.round(totalGained / 12))}/week` },
  { label: "Total Lost (12w)", value: formatNumber(totalLost), icon: <UserMinus size={18} />, color: "from-rose-500 to-rose-700", sub: `~${formatNumber(Math.round(totalLost / 12))}/week` },
  { label: "Avg Engagement", value: `${avgEngagement}%`, icon: <Zap size={18} />, color: "from-amber-500 to-amber-700", sub: `${latestData.engagementRate > previousData.engagementRate ? "↑" : "↓"} from ${previousData.engagementRate}%` },
];

export default function FollowerGrowth() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);

  if (!hasLoaded) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Follower Growth</h1>
          <p className="mt-1 text-sm text-dark-400">Track @GenLayer follower acquisition, churn, and engagement</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <TrendingUp size={40} className="text-dark-600 mb-4" />
          <h3 className="text-white font-semibold mb-1">Fetch Growth Data</h3>
          <p className="text-xs text-dark-400 mb-4">Growth analytics requires an on-chain data query</p>
          <button
            onClick={() => setShowGasModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500"
          >
            <Zap size={14} /> Sign & Fetch Data
          </button>
        </div>
        <GasConfirmModal
          isOpen={showGasModal}
          action="track_growth"
          description="Fetch follower growth analytics for @GenLayer"
          onConfirm={() => { setShowGasModal(false); setHasLoaded(true); }}
          onCancel={() => setShowGasModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Smart Follower Growth</h1>
        <p className="mt-1 text-sm text-dark-400">@GenLayer follower acquisition, churn, and engagement — verified on GenLayer</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/5 bg-dark-900/60 p-5 backdrop-blur-sm hover:border-white/10">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white shadow-lg`}>{s.icon}</div>
            <p className="mt-3 text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-dark-400">{s.label}</p>
            <p className="mt-1 text-[10px] text-dark-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white">@GenLayer Follower Growth Curve</h3>
        <p className="mb-4 text-xs text-dark-400">Weekly follower count over 12 weeks</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={followerGrowth}>
            <defs><linearGradient id="gFollowers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} /><stop offset="95%" stopColor="#818cf8" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} formatter={(value) => [formatNumber(Number(value)), "Followers"]} />
            <Area type="monotone" dataKey="followers" stroke="#818cf8" fill="url(#gFollowers)" strokeWidth={2.5} dot={{ r: 3, fill: "#818cf8" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white">Gained vs Lost</h3>
          <p className="mb-4 text-xs text-dark-400">Weekly follower acquisition & churn</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={followerGrowth} barGap={4}>
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
              <Bar dataKey="gained" fill="#34d399" radius={[4, 4, 0, 0]} name="Gained" />
              <Bar dataKey="lost" fill="#fb7185" radius={[4, 4, 0, 0]} name="Lost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white">Engagement Rate</h3>
          <p className="mb-4 text-xs text-dark-400">Weekly engagement rate trend</p>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={followerGrowth}>
              <defs><linearGradient id="gEngagement" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} /><stop offset="95%" stopColor="#fbbf24" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 10]} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="engagementRate" stroke="#fbbf24" fill="url(#gEngagement)" strokeWidth={2} name="Rate (%)" />
              <Line type="monotone" dataKey="engagementRate" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3, fill: "#fbbf24" }} name="Rate (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-white">Weekly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b border-white/5 text-dark-500"><th className="pb-3 pr-4 font-medium">Week</th><th className="pb-3 pr-4 font-medium">Followers</th><th className="pb-3 pr-4 font-medium">Gained</th><th className="pb-3 pr-4 font-medium">Lost</th><th className="pb-3 pr-4 font-medium">Net</th><th className="pb-3 font-medium">Engagement</th></tr></thead>
            <tbody>
              {followerGrowth.map((d) => (
                <tr key={d.date} className="border-b border-white/5 last:border-0 hover:bg-white/[.02]">
                  <td className="py-2.5 pr-4 text-white font-medium">{d.date}</td>
                  <td className="py-2.5 pr-4 text-dark-300">{formatNumber(d.followers)}</td>
                  <td className="py-2.5 pr-4 text-emerald-400">+{formatNumber(d.gained)}</td>
                  <td className="py-2.5 pr-4 text-rose-400">-{formatNumber(d.lost)}</td>
                  <td className="py-2.5 pr-4 text-brand-400">+{formatNumber(d.gained - d.lost)}</td>
                  <td className="py-2.5 text-amber-400">{d.engagementRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
