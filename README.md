# 🧬 SocialPulse — GenLayer Social Intelligence Dashboard

A social intelligence dApp built on [GenLayer](https://genlayer.com) — the AI-native blockchain. The project includes a **real Intelligent Contract** deployed on GenLayer Bradbury Testnet that fetches live data from X (Twitter), analyzes sentiment using LLMs, and computes mindshare rankings — all verified on-chain through validator consensus.

![GenLayer](https://img.shields.io/badge/GenLayer-Bradbury_Testnet-purple)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📜 Intelligent Contract

The core of this project is `contracts/social_intelligence.py` — a Python Intelligent Contract running on GenLayer that uses:

| GenLayer Feature | Usage |
|---|---|
| `gl.Contract` | Contract class inheriting GenLayer base |
| `gl.get_webpage()` | Fetches live X/Twitter data on-chain without oracles |
| `gl.exec_prompt()` | Calls LLM for sentiment analysis and mindshare ranking |
| `gl.eq_principle_strict_eq()` | Validator consensus on non-deterministic outputs |
| `@gl.public.write` | 4 write methods — `fetch_genlayer_posts`, `analyze_sentiment`, `analyze_mindshare`, `search_topic` |
| `@gl.public.view` | 5 read methods — `get_latest_posts`, `get_sentiment`, `get_mindshare`, `get_stats`, `get_all_data` |

### How Consensus Works

```
User signs tx via MetaMask
  → Transaction submitted to GenLayer Bradbury Testnet
    → Multiple validators independently:
        1. Fetch webpage data (gl.get_webpage)
        2. Run LLM analysis (gl.exec_prompt)
        3. Produce output
    → Validators compare outputs (gl.eq_principle_strict_eq)
    → If equivalent → result accepted & stored on-chain
    → Frontend reads result via view method (free)
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MetaMask](https://metamask.io/) browser extension
- GEN tokens from [GenLayer Faucet](https://testnet-faucet.genlayer.foundation/)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/socialpulse.git
cd socialpulse
npm install
```

### 2. Deploy the Intelligent Contract

```bash
# Fund your wallet first:
# → https://testnet-faucet.genlayer.foundation/

# Deploy to Bradbury Testnet
PRIVATE_KEY=0xYourPrivateKey npx tsx contracts/deploy.ts
```

The script will output your contract address:
```
✅ Contract deployed successfully!
📍 Contract address: 0x1234...abcd
```

### 3. Configure & Run

```bash
# Create env file
cp .env.example .env

# Edit .env — paste your contract address
# VITE_CONTRACT_ADDRESS=0x1234...abcd

# Start development server
npm run dev
```

### 4. Connect MetaMask

1. Open the app in your browser
2. Click **Connect** → MetaMask will prompt to add **GenLayer Bradbury Testnet**
3. Approve the network addition
4. You're connected! Every action is now signed on-chain.

---

## 🔧 GenLayer Bradbury Testnet

| Setting | Value |
|---|---|
| **Network Name** | GenLayer Bradbury Testnet |
| **Chain ID** | 4221 (`0x107D`) |
| **RPC URL** | `https://rpc-bradbury.genlayer.com` |
| **Currency** | GEN |
| **Block Explorer** | `https://explorer-bradbury.genlayer.com` |
| **Faucet** | [testnet-faucet.genlayer.foundation](https://testnet-faucet.genlayer.foundation/) |

---

## 📊 Features

### Dashboard
- Network status (chain ID, block height, validators)
- Contract connection status with explorer link
- Sentiment charts (area, pie)
- Trending topics with engagement data
- Gas fee reference table

### Search Posts
- Fetch all @GenLayer posts (requires contract call + gas)
- Sentiment analysis per post (positive / neutral / negative)
- Mindshare sidebar ranking contributors
- Filter by text, sentiment, topic
- Supports live X API data via optional proxy

### Find People
- Browse X users who post about @GenLayer
- Click user → pay gas → see all their GenLayer posts
- Per-user mindshare score, rank, sentiment breakdown
- Influence score and topic tags

### Profiles (My Profile + Explore)
- **My Profile**: Connect X handle → view your GenLayer posts, mindshare score, weekly trend chart, sentiment breakdown
- **Explore**: Browse ecosystem profiles with banner, stats, and posts

### Tweet Timeline
- Chronological feed with sentiment-colored timeline dots
- Filter by account
- Engagement metrics per tweet

### Project Sentiment
- Cards / stacked bar chart / radar chart views
- 8 GenLayer sub-projects analyzed
- Score rings and trend indicators

### Follower Growth
- @GenLayer follower curve over 12 weeks
- Gained vs lost bar chart
- Engagement rate trend
- Weekly breakdown table

### Mindshare Rankings
- Top 3 podium display
- Full ranking table with mindshare bars
- "My Mindshare" tab (when X account connected)
- Horizontal bar chart view

---

## 🐦 X API — Live Data (Optional)

By default the app uses mock data. To fetch **real posts** from X, set up the included proxy server.

### Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env → X_BEARER_TOKEN=your_token

npm start
# → http://localhost:3001
```

Then in the root `.env`:
```
VITE_X_API_PROXY_URL=http://localhost:3001
```

### Getting an X API Key

1. Go to [X Developer Portal](https://developer.x.com/en/portal/dashboard)
2. Create a project → Generate **Bearer Token**
3. Paste into `server/.env`

> **X API Pricing (2026):** Pay-per-use ~$0.005/read. No free read tier.
> **Cheaper alternatives:** [TwitterAPI.io](https://twitterapi.io) ($0.00015/read), [GetXAPI](https://getxapi.com) ($0.05/1K tweets).
> Set `X_API_BASE_URL` in `server/.env` to use alternatives.

---

## 📁 Project Structure

```
socialpulse/
├── contracts/
│   ├── social_intelligence.py   # GenLayer Intelligent Contract
│   └── deploy.ts                # Deploy script for Bradbury Testnet
├── server/
│   ├── index.js                 # X API proxy server
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── src/
│   ├── components/
│   │   ├── ConnectPanel.tsx      # MetaMask + X connection panel
│   │   ├── GasConfirmModal.tsx   # Transaction signing modal
│   │   ├── DashboardOverview.tsx # Main dashboard with contract status
│   │   ├── SearchPosts.tsx       # Post search with mindshare sidebar
│   │   ├── FindPeople.tsx        # User search + profile detail
│   │   ├── TwitterProfiles.tsx   # My Profile + Explore
│   │   ├── TweetTimeline.tsx     # Chronological feed
│   │   ├── ProjectSentiment.tsx  # Sentiment analysis views
│   │   ├── FollowerGrowth.tsx    # Growth analytics
│   │   ├── MindshareRankings.tsx # Mindshare leaderboard
│   │   └── Sidebar.tsx           # Navigation
│   ├── services/
│   │   ├── metamask.ts           # MetaMask wallet + chain management
│   │   ├── genlayer.ts           # GenLayer SDK wrapper
│   │   ├── contract.ts           # Intelligent Contract read/write
│   │   ├── xApi.ts               # X API (live + mock fallback)
│   │   └── xProfile.ts           # X profile connection
│   ├── data/
│   │   └── mockData.ts           # Mock data for demo mode
│   ├── utils/
│   │   └── format.ts             # Formatting helpers
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind + custom styles
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Blockchain** | GenLayer (Bradbury Testnet, chain 4221) |
| **Smart Contract** | Python Intelligent Contract (`gl.Contract`) |
| **Frontend SDK** | `genlayer-js` |
| **Wallet** | MetaMask (EIP-1193) |
| **Framework** | React 19 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Build** | Vite |

---

## 📚 GenLayer Resources

- [GenLayer Docs](https://docs.genlayer.com)
- [GenLayer Studio](https://studio.genlayer.com)
- [GenLayerJS SDK](https://docs.genlayer.com/api-references/genlayer-js)
- [Intelligent Contracts Guide](https://docs.genlayer.com/developers/intelligent-contracts/introduction)
- [GenLayer Faucet](https://testnet-faucet.genlayer.foundation/)
- [GenLayer Explorer](https://explorer-bradbury.genlayer.com)
- [GenLayer on X](https://x.com/GenLayer)

---

## 📄 License

MIT — see [LICENSE](LICENSE).
