import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus, Zap } from "lucide-react";
import { projectSentiments } from "../data/mockData";
import { formatNumber } from "../utils/format";
import GasConfirmModal from "./GasConfirmModal";

export default function ProjectSentiment() {
  const [view, setView] = useState<"cards" | "chart" | "radar">("cards");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);

  const chartData = projectSentiments.map((p) => ({
    name: p.project.split("/")[0].trim().slice(0, 12),
    positive: p.positive,
    neutral: p.neutral,
    negative: p.negative,
  }));

  const radarData = projectSentiments.map((p) => ({
    project: p.project.split("/")[0].trim().slice(0, 10),
    score: p.score,
  }));

  if (!hasLoaded) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Sentiment</h1>
          <p className="mt-1 text-sm text-dark-400">Track public opinion across GenLayer sub-projects</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <Zap size={40} className="text-dark-600 mb-4" />
          <h3 className="text-white font-semibold mb-1">Analyze Sentiment</h3>
          <p className="text-xs text-dark-400 mb-4">Sentiment analysis runs as an Intelligent Contract on GenLayer</p>
          <button
            onClick={() => setShowGasModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500"
          >
            <Zap size={14} /> Sign & Analyze
          </button>
        </div>
        <GasConfirmModal
          isOpen={showGasModal}
          action="analyze_sentiment"
          description="Run sentiment analysis on GenLayer ecosystem projects"
          onConfirm={() => { setShowGasModal(false); setHasLoaded(true); }}
          onCancel={() => setShowGasModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Sentiment</h1>
          <p className="mt-1 text-sm text-dark-400">GenLayer ecosystem project sentiment — verified on-chain</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-dark-900/60 p-1">
          {(["cards", "chart", "radar"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all ${view === v ? "bg-brand-600/20 text-brand-400" : "text-dark-400 hover:text-dark-200"}`}>{v}</button>
          ))}
        </div>
      </div>

      {view === "cards" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projectSentiments.map((p) => (
            <div key={p.project} className="rounded-xl border border-white/5 bg-dark-900/60 p-5 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-dark-900/80">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.icon}</span>
                  <div><h3 className="text-sm font-semibold text-white">{p.project}</h3><p className="text-[10px] text-dark-500">{formatNumber(p.total)} mentions</p></div>
                </div>
                <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${p.trending === "up" ? "bg-emerald-500/10 text-emerald-400" : p.trending === "down" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {p.trending === "up" && <ArrowUpRight size={10} />}{p.trending === "down" && <ArrowDownRight size={10} />}{p.trending === "stable" && <Minus size={10} />}{p.trending}
                </div>
              </div>
              <div className="my-4 flex items-center justify-center">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke={p.score >= 70 ? "#34d399" : p.score >= 50 ? "#fbbf24" : "#fb7185"} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${p.score * 0.942} 100`} />
                  </svg>
                  <span className="text-lg font-bold text-white">{p.score}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]"><span className="text-emerald-400">Positive</span><span className="text-dark-400">{p.positive}%</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${p.positive}%` }} /></div>
                <div className="flex items-center justify-between text-[10px]"><span className="text-amber-400">Neutral</span><span className="text-dark-400">{p.neutral}%</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800"><div className="h-full rounded-full bg-amber-400" style={{ width: `${p.neutral}%` }} /></div>
                <div className="flex items-center justify-between text-[10px]"><span className="text-rose-400">Negative</span><span className="text-dark-400">{p.negative}%</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-800"><div className="h-full rounded-full bg-rose-400" style={{ width: `${p.negative}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "chart" && (
        <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-white">Sentiment Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} barGap={2}>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
              <Bar dataKey="positive" stackId="a" fill="#34d399" /><Bar dataKey="neutral" stackId="a" fill="#fbbf24" /><Bar dataKey="negative" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === "radar" && (
        <div className="rounded-xl border border-white/5 bg-dark-900/60 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-white">Sentiment Score Radar</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="project" tick={{ fill: "#94a3b8", fontSize: 11 }} /><PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 10 }} angle={30} domain={[0, 100]} />
              <Radar name="Score" dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
