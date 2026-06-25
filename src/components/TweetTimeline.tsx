import { useState } from "react";
import { Heart, Repeat2, MessageCircle, Eye, Zap } from "lucide-react";
import { tweets, twitterProfiles } from "../data/mockData";
import { formatNumber, getSentimentBg } from "../utils/format";
import GasConfirmModal from "./GasConfirmModal";

export default function TweetTimeline() {
  const [selectedProfile, setSelectedProfile] = useState<string>("all");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);

  const filteredTweets = selectedProfile === "all"
    ? tweets
    : tweets.filter((t) => t.profileId === selectedProfile);

  const handleLoad = () => {
    setShowGasModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tweet Timeline</h1>
          <p className="mt-1 text-sm text-dark-400">Chronological feed of GenLayer ecosystem accounts</p>
        </div>
        {!hasLoaded && (
          <button
            onClick={handleLoad}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-colors"
          >
            <Zap size={14} /> Load Timeline
          </button>
        )}
      </div>

      {hasLoaded ? (
        <>
          {/* Profile Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedProfile("all")}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedProfile === "all"
                  ? "bg-brand-600/20 text-brand-400 ring-1 ring-brand-500/30"
                  : "bg-dark-800/50 text-dark-400 hover:bg-dark-800 hover:text-dark-200"
              }`}
            >
              All Accounts
            </button>
            {twitterProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  selectedProfile === p.id
                    ? "bg-brand-600/20 text-brand-400 ring-1 ring-brand-500/30"
                    : "bg-dark-800/50 text-dark-400 hover:bg-dark-800 hover:text-dark-200"
                }`}
              >
                <span className="text-base">{p.avatar}</span>
                {p.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[29px] top-0 h-full w-px bg-gradient-to-b from-brand-500/30 via-brand-500/10 to-transparent" />
            <div className="space-y-4">
              {filteredTweets.map((tweet, idx) => (
                <div key={tweet.id} className="relative flex gap-4 pl-2" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="relative z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${
                      tweet.sentiment === "positive" ? "bg-emerald-400 shadow-lg shadow-emerald-400/30" :
                      tweet.sentiment === "negative" ? "bg-rose-400 shadow-lg shadow-rose-400/30" :
                      "bg-amber-400 shadow-lg shadow-amber-400/30"
                    }`} />
                  </div>
                  <div className="flex-1 rounded-xl border border-white/5 bg-dark-900/60 p-5 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-dark-900/80">
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
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {tweet.topics.map((topic) => (
                              <span key={topic} className="rounded-md bg-brand-600/10 px-2 py-0.5 text-[10px] font-medium text-brand-400">#{topic}</span>
                            ))}
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getSentimentBg(tweet.sentiment)}`}>{tweet.sentiment}</span>
                          </div>
                          <div className="flex items-center gap-4 text-dark-500">
                            <span className="flex items-center gap-1 text-[11px]"><Heart size={12} /> {formatNumber(tweet.likes)}</span>
                            <span className="flex items-center gap-1 text-[11px]"><Repeat2 size={12} /> {formatNumber(tweet.retweets)}</span>
                            <span className="flex items-center gap-1 text-[11px]"><MessageCircle size={12} /> {formatNumber(tweet.replies)}</span>
                            <span className="flex items-center gap-1 text-[11px]"><Eye size={12} /> {formatNumber(tweet.views)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-dark-900/40 py-20">
          <Zap size={40} className="text-dark-600 mb-4" />
          <h3 className="text-white font-semibold mb-1">Load Timeline</h3>
          <p className="text-xs text-dark-400 mb-4">Fetching the timeline requires an on-chain transaction</p>
          <button
            onClick={handleLoad}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500"
          >
            <Zap size={14} /> Sign & Load Timeline
          </button>
        </div>
      )}

      <GasConfirmModal
        isOpen={showGasModal}
        action="fetch_timeline"
        description="Fetch latest timeline data from GenLayer ecosystem"
        onConfirm={() => { setShowGasModal(false); setHasLoaded(true); }}
        onCancel={() => setShowGasModal(false)}
      />
    </div>
  );
}
