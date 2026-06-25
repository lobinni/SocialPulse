export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export function formatPercent(num: number): string {
  return num.toFixed(1) + "%";
}

export function getSentimentColor(sentiment: "positive" | "neutral" | "negative" | number): string {
  if (typeof sentiment === "string") {
    switch (sentiment) {
      case "positive": return "text-emerald-400";
      case "neutral": return "text-amber-400";
      case "negative": return "text-rose-400";
    }
  }
  if (sentiment >= 70) return "text-emerald-400";
  if (sentiment >= 50) return "text-amber-400";
  return "text-rose-400";
}

export function getSentimentBg(sentiment: "positive" | "neutral" | "negative" | number): string {
  if (typeof sentiment === "string") {
    switch (sentiment) {
      case "positive": return "bg-emerald-500/20 text-emerald-400";
      case "neutral": return "bg-amber-500/20 text-amber-400";
      case "negative": return "bg-rose-500/20 text-rose-400";
    }
  }
  if (sentiment >= 70) return "bg-emerald-500/20 text-emerald-400";
  if (sentiment >= 50) return "bg-amber-500/20 text-amber-400";
  return "bg-rose-500/20 text-rose-400";
}

export function getTrendIcon(change: number): string {
  if (change > 0) return "↑";
  if (change < 0) return "↓";
  return "→";
}

export function getTrendColor(change: number): string {
  if (change > 0) return "text-emerald-400";
  if (change < 0) return "text-rose-400";
  return "text-amber-400";
}
