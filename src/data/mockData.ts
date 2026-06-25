// ══════════════════════════════════════
// Mock data focused on GenLayer ecosystem
// ══════════════════════════════════════

// ── Twitter Profiles ──
export interface TwitterProfile {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  tweets: number;
  verified: boolean;
  joinDate: string;
  location: string;
  website: string;
  bannerColor: string;
}

export const twitterProfiles: TwitterProfile[] = [
  {
    id: "1",
    handle: "@GenLayer",
    name: "GenLayer",
    avatar: "🧬",
    bio: "The Intelligence Layer of the Internet. AI-native blockchain with Intelligent Contracts. Build the future with us.",
    followers: 48_200,
    following: 312,
    tweets: 2_840,
    verified: true,
    joinDate: "March 2024",
    location: "Decentralized",
    website: "genlayer.com",
    bannerColor: "from-violet-700 to-indigo-900",
  },
  {
    id: "2",
    handle: "@candela_net",
    name: "Candela",
    avatar: "🕯️",
    bio: "GenLayer ecosystem contributor. Building Intelligent Contracts for real-world use cases.",
    followers: 12_400,
    following: 680,
    tweets: 1_200,
    verified: false,
    joinDate: "June 2024",
    location: "Global",
    website: "candela.dev",
    bannerColor: "from-amber-700 to-orange-900",
  },
  {
    id: "3",
    handle: "@0xGenBuilder",
    name: "GenBuilder",
    avatar: "🔧",
    bio: "Full-stack GenLayer dev. Writing Intelligent Contracts in Python. GenVM enthusiast.",
    followers: 5_800,
    following: 420,
    tweets: 890,
    verified: false,
    joinDate: "Sept 2024",
    location: "Berlin",
    website: "genbuilder.xyz",
    bannerColor: "from-emerald-700 to-teal-900",
  },
  {
    id: "4",
    handle: "@AIValidatorNode",
    name: "AI Validator",
    avatar: "🤖",
    bio: "Running GenLayer validator nodes. Staking, validating, and securing the AI-native blockchain.",
    followers: 3_200,
    following: 890,
    tweets: 560,
    verified: false,
    joinDate: "Nov 2024",
    location: "Cloud",
    website: "aivalidator.io",
    bannerColor: "from-cyan-700 to-blue-900",
  },
  {
    id: "5",
    handle: "@GenLayerDAO",
    name: "GenLayer DAO",
    avatar: "🏛️",
    bio: "Community governance for the GenLayer ecosystem. Proposals, voting, and community building.",
    followers: 8_900,
    following: 245,
    tweets: 1_450,
    verified: true,
    joinDate: "Jan 2025",
    location: "On-chain",
    website: "dao.genlayer.com",
    bannerColor: "from-purple-700 to-fuchsia-900",
  },
  {
    id: "6",
    handle: "@IntelligentDev",
    name: "Intelligent Developer",
    avatar: "💡",
    bio: "Teaching devs how to build on GenLayer. Tutorials, workshops, and deep dives into GenVM.",
    followers: 6_700,
    following: 520,
    tweets: 980,
    verified: false,
    joinDate: "Aug 2024",
    location: "Online",
    website: "intelligentdev.io",
    bannerColor: "from-rose-700 to-pink-900",
  },
];

// ── Tweets ──
export interface Tweet {
  id: string;
  profileId: string;
  handle: string;
  name: string;
  avatar: string;
  verified: boolean;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  sentiment: "positive" | "neutral" | "negative";
  topics: string[];
}

export const tweets: Tweet[] = [
  {
    id: "t1", profileId: "1", handle: "@GenLayer", name: "GenLayer", avatar: "🧬", verified: true,
    content: "🚀 Testnet Asimov Phase 5 is LIVE! Intelligent Contracts now support full web data access through GenVM. Build AI-powered dApps that read real-world data on-chain. This changes everything.",
    timestamp: "2h ago", likes: 4_200, retweets: 1_800, replies: 340, views: 89_000,
    sentiment: "positive", topics: ["GenLayer", "Testnet", "GenVM"],
  },
  {
    id: "t2", profileId: "1", handle: "@GenLayer", name: "GenLayer", avatar: "🧬", verified: true,
    content: "Optimistic Democracy Consensus explained in 60 seconds: Validators use LLMs to verify results are 'equivalent enough' — not identical. This enables non-deterministic computation on-chain. 🧠",
    timestamp: "5h ago", likes: 3_100, retweets: 1_200, replies: 210, views: 62_000,
    sentiment: "positive", topics: ["GenLayer", "Consensus", "AI"],
  },
  {
    id: "t3", profileId: "2", handle: "@candela_net", name: "Candela", avatar: "🕯️", verified: false,
    content: "Just deployed my first Intelligent Contract on GenLayer Studio. The Python-based smart contracts + LLM integration is 🤯. GenVM makes web3 development feel like the future.",
    timestamp: "4h ago", likes: 890, retweets: 320, replies: 88, views: 12_000,
    sentiment: "positive", topics: ["GenLayer", "IntelligentContracts", "Python"],
  },
  {
    id: "t4", profileId: "3", handle: "@0xGenBuilder", name: "GenBuilder", avatar: "🔧", verified: false,
    content: "Thread 🧵: How to build a decentralized oracle on GenLayer that reads live data from any website. No centralized oracle needed. Step-by-step guide below 👇",
    timestamp: "8h ago", likes: 1_500, retweets: 680, replies: 120, views: 28_000,
    sentiment: "positive", topics: ["GenLayer", "Oracle", "Tutorial"],
  },
  {
    id: "t5", profileId: "4", handle: "@AIValidatorNode", name: "AI Validator", avatar: "🤖", verified: false,
    content: "Running a GenLayer validator for 2 weeks now. The staking rewards are solid, and the GenVM execution model is fascinating. Each validator independently uses LLMs to verify contract outputs.",
    timestamp: "12h ago", likes: 620, retweets: 180, replies: 45, views: 8_500,
    sentiment: "positive", topics: ["GenLayer", "Staking", "Validator"],
  },
  {
    id: "t6", profileId: "1", handle: "@GenLayer", name: "GenLayer", avatar: "🧬", verified: true,
    content: "⚠️ Important update: We've identified a gas estimation issue on Studionet affecting some complex Intelligent Contracts. Patch rolling out in 2 hours. Localnet unaffected.",
    timestamp: "14h ago", likes: 1_800, retweets: 920, replies: 280, views: 45_000,
    sentiment: "negative", topics: ["GenLayer", "Update", "Bug"],
  },
  {
    id: "t7", profileId: "5", handle: "@GenLayerDAO", name: "GenLayer DAO", avatar: "🏛️", verified: true,
    content: "📊 Governance Proposal #12 is now live: Increase validator rewards by 15% to attract more node operators. Voting ends in 72 hours. Cast your vote on-chain!",
    timestamp: "1d ago", likes: 2_400, retweets: 890, replies: 340, views: 38_000,
    sentiment: "neutral", topics: ["GenLayer", "DAO", "Governance"],
  },
  {
    id: "t8", profileId: "6", handle: "@IntelligentDev", name: "Intelligent Developer", avatar: "💡", verified: false,
    content: "New tutorial: Building a prediction market on GenLayer that resolves automatically by reading sports results from the web. No oracle middleware needed! Full code on GitHub.",
    timestamp: "1d ago", likes: 1_100, retweets: 480, replies: 92, views: 18_000,
    sentiment: "positive", topics: ["GenLayer", "Tutorial", "PredictionMarket"],
  },
  {
    id: "t9", profileId: "3", handle: "@0xGenBuilder", name: "GenBuilder", avatar: "🔧", verified: false,
    content: "The Equivalence Principle in GenLayer is brilliant. Validators don't need exact same outputs — just 'equivalent enough'. This unlocks AI-powered computation while maintaining security.",
    timestamp: "2d ago", likes: 780, retweets: 290, replies: 64, views: 14_000,
    sentiment: "positive", topics: ["GenLayer", "EquivalencePrinciple", "Security"],
  },
  {
    id: "t10", profileId: "2", handle: "@candela_net", name: "Candela", avatar: "🕯️", verified: false,
    content: "Concerned about the centralization of LLM providers used by GenLayer validators. If most validators use the same model, doesn't that reduce the diversity benefit? Open question for the community.",
    timestamp: "2d ago", likes: 560, retweets: 210, replies: 145, views: 11_000,
    sentiment: "negative", topics: ["GenLayer", "Decentralization", "LLM"],
  },
];

// ── Sentiment Data ──
export interface SentimentDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export const sentimentTimeline: SentimentDataPoint[] = [
  { date: "Jan", positive: 62, neutral: 25, negative: 13 },
  { date: "Feb", positive: 58, neutral: 28, negative: 14 },
  { date: "Mar", positive: 65, neutral: 22, negative: 13 },
  { date: "Apr", positive: 70, neutral: 20, negative: 10 },
  { date: "May", positive: 72, neutral: 18, negative: 10 },
  { date: "Jun", positive: 68, neutral: 22, negative: 10 },
  { date: "Jul", positive: 75, neutral: 16, negative: 9 },
  { date: "Aug", positive: 78, neutral: 14, negative: 8 },
  { date: "Sep", positive: 74, neutral: 18, negative: 8 },
  { date: "Oct", positive: 80, neutral: 14, negative: 6 },
  { date: "Nov", positive: 76, neutral: 16, negative: 8 },
  { date: "Dec", positive: 82, neutral: 12, negative: 6 },
];

// ── Follower Growth (GenLayer @GenLayer) ──
export interface FollowerGrowthPoint {
  date: string;
  followers: number;
  gained: number;
  lost: number;
  engagementRate: number;
}

export const followerGrowth: FollowerGrowthPoint[] = [
  { date: "W1", followers: 32_000, gained: 1_200, lost: 80, engagementRate: 6.2 },
  { date: "W2", followers: 33_120, gained: 1_400, lost: 90, engagementRate: 6.5 },
  { date: "W3", followers: 34_430, gained: 1_600, lost: 100, engagementRate: 6.8 },
  { date: "W4", followers: 35_930, gained: 1_800, lost: 110, engagementRate: 7.1 },
  { date: "W5", followers: 37_620, gained: 2_000, lost: 95, engagementRate: 7.3 },
  { date: "W6", followers: 39_525, gained: 2_200, lost: 105, engagementRate: 7.6 },
  { date: "W7", followers: 41_620, gained: 2_400, lost: 120, engagementRate: 7.2 },
  { date: "W8", followers: 43_900, gained: 2_600, lost: 110, engagementRate: 7.8 },
  { date: "W9", followers: 46_390, gained: 2_800, lost: 130, engagementRate: 7.4 },
  { date: "W10", followers: 49_060, gained: 3_000, lost: 115, engagementRate: 7.9 },
  { date: "W11", followers: 51_945, gained: 3_200, lost: 125, engagementRate: 8.1 },
  { date: "W12", followers: 55_020, gained: 3_400, lost: 140, engagementRate: 8.4 },
];

// ── Mindshare Rankings — GenLayer Ecosystem ──
export interface MindshareEntry {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  mindshare: number;
  change: number;
  mentions: number;
  sentiment: number;
  category: string;
}

export const mindshareRankings: MindshareEntry[] = [
  { rank: 1, name: "GenLayer", handle: "@GenLayer", avatar: "🧬", mindshare: 38.4, change: 4.2, mentions: 24_800, sentiment: 82, category: "Core" },
  { rank: 2, name: "GenLayer DAO", handle: "@GenLayerDAO", avatar: "🏛️", mindshare: 18.2, change: 2.8, mentions: 12_400, sentiment: 74, category: "Governance" },
  { rank: 3, name: "Candela", handle: "@candela_net", avatar: "🕯️", mindshare: 12.6, change: 5.1, mentions: 8_200, sentiment: 78, category: "Ecosystem" },
  { rank: 4, name: "GenBuilder", handle: "@0xGenBuilder", avatar: "🔧", mindshare: 9.8, change: 3.4, mentions: 6_400, sentiment: 85, category: "Developer" },
  { rank: 5, name: "Intelligent Dev", handle: "@IntelligentDev", avatar: "💡", mindshare: 8.4, change: 1.9, mentions: 5_200, sentiment: 80, category: "Education" },
  { rank: 6, name: "AI Validator", handle: "@AIValidatorNode", avatar: "🤖", mindshare: 6.2, change: -0.8, mentions: 3_800, sentiment: 72, category: "Infrastructure" },
  { rank: 7, name: "GenVM Labs", handle: "@GenVMLabs", avatar: "⚡", mindshare: 4.1, change: 6.2, mentions: 2_600, sentiment: 76, category: "Research" },
  { rank: 8, name: "Smart Oracle", handle: "@SmartOracleGen", avatar: "🔮", mindshare: 2.3, change: 1.4, mentions: 1_400, sentiment: 68, category: "DeFi" },
];

// ── Project Sentiment — GenLayer sub-projects ──
export interface ProjectSentiment {
  project: string;
  icon: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  trending: "up" | "down" | "stable";
  score: number;
}

export const projectSentiments: ProjectSentiment[] = [
  { project: "GenLayer Core", icon: "🧬", positive: 78, neutral: 14, negative: 8, total: 42_000, trending: "up", score: 85 },
  { project: "GenVM Runtime", icon: "⚡", positive: 72, neutral: 18, negative: 10, total: 28_000, trending: "up", score: 78 },
  { project: "Intelligent Contracts", icon: "📜", positive: 82, neutral: 12, negative: 6, total: 35_000, trending: "up", score: 88 },
  { project: "Testnet Asimov", icon: "🧪", positive: 65, neutral: 20, negative: 15, total: 22_000, trending: "stable", score: 70 },
  { project: "GenLayer Studio", icon: "🎨", positive: 70, neutral: 18, negative: 12, total: 18_000, trending: "up", score: 74 },
  { project: "Staking / Validators", icon: "🛡️", positive: 60, neutral: 24, negative: 16, total: 15_000, trending: "stable", score: 66 },
  { project: "GenLayer DAO", icon: "🏛️", positive: 68, neutral: 22, negative: 10, total: 12_000, trending: "up", score: 72 },
  { project: "SDK / genlayer-js", icon: "🔧", positive: 74, neutral: 16, negative: 10, total: 9_000, trending: "up", score: 78 },
];

// ── Search People ──
export interface Person {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  followers: number;
  influence: number;
  topics: string[];
}

export const people: Person[] = [
  { id: "1", name: "GenLayer", handle: "@GenLayer", avatar: "🧬", role: "AI-native Blockchain", followers: 48_200, influence: 98, topics: ["GenLayer", "AI", "Blockchain"] },
  { id: "2", name: "Candela", handle: "@candela_net", avatar: "🕯️", role: "Ecosystem Contributor", followers: 12_400, influence: 82, topics: ["GenLayer", "DeFi", "dApps"] },
  { id: "3", name: "GenBuilder", handle: "@0xGenBuilder", avatar: "🔧", role: "Core Developer", followers: 5_800, influence: 78, topics: ["GenLayer", "GenVM", "Python"] },
  { id: "4", name: "AI Validator", handle: "@AIValidatorNode", avatar: "🤖", role: "Validator Operator", followers: 3_200, influence: 65, topics: ["GenLayer", "Staking", "Infra"] },
  { id: "5", name: "GenLayer DAO", handle: "@GenLayerDAO", avatar: "🏛️", role: "Community Governance", followers: 8_900, influence: 88, topics: ["GenLayer", "DAO", "Governance"] },
  { id: "6", name: "Intelligent Dev", handle: "@IntelligentDev", avatar: "💡", role: "Educator & Builder", followers: 6_700, influence: 75, topics: ["GenLayer", "Tutorials", "Education"] },
  { id: "7", name: "GenVM Labs", handle: "@GenVMLabs", avatar: "⚡", role: "Research Lab", followers: 4_100, influence: 70, topics: ["GenLayer", "GenVM", "Research"] },
  { id: "8", name: "Smart Oracle", handle: "@SmartOracleGen", avatar: "🔮", role: "Oracle Developer", followers: 2_800, influence: 62, topics: ["GenLayer", "Oracle", "DeFi"] },
];

// ── Topic Trends ──
export interface TopicTrend {
  topic: string;
  volume: number;
  change: number;
  sentiment: number;
}

export const topicTrends: TopicTrend[] = [
  { topic: "GenLayer", volume: 42_000, change: 28.5, sentiment: 82 },
  { topic: "IntelligentContracts", volume: 28_000, change: 18.2, sentiment: 85 },
  { topic: "GenVM", volume: 18_000, change: 12.4, sentiment: 78 },
  { topic: "Testnet", volume: 14_000, change: 8.6, sentiment: 70 },
  { topic: "AI Blockchain", volume: 22_000, change: 32.1, sentiment: 76 },
  { topic: "Staking", volume: 9_000, change: -2.3, sentiment: 64 },
];
