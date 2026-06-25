# 🧬 SocialPulse — Social Intelligence Dashboard

> Powered by [GenLayer](https://genlayer.com) — The Intelligence Layer of the Internet

A comprehensive social intelligence dashboard for tracking and analyzing the GenLayer ecosystem. Built with React, TypeScript, and integrated with the GenLayer blockchain network via MetaMask.

![GenLayer](https://img.shields.io/badge/GenLayer-Bradbury_Testnet-purple)
![React](https://img.shields.io/badge/React-19.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-cyan)

## ✨ Features

### 🔗 GenLayer Blockchain Integration
- **MetaMask Wallet Connection** — Connect your MetaMask wallet to interact with GenLayer
- **Automatic Chain Addition** — One-click add GenLayer Bradbury Testnet to MetaMask on first connection
- **On-Chain Transactions** — All actions are signed and verified on GenLayer network
- **Real-Time Network Status** — Monitor chain ID, block height, and connection status

### 📊 Social Intelligence Tools

| Feature | Description | Gas Fee | USD Est. |
|---------|-------------|---------|----------|
| **Search Posts** | Search @GenLayer posts from X with sentiment analysis | 0.0012 GEN | ~$0.00018 |
| **Find People** | Discover GenLayer ecosystem influencers | 0.0008 GEN | ~$0.00012 |
| **Profile Lookup** | View detailed Twitter/X profiles | 0.0015 GEN | ~$0.00023 |
| **Tweet Timeline** | Chronological feed of ecosystem accounts | 0.0020 GEN | ~$0.00030 |
| **Project Sentiment** | AI-powered sentiment analysis via Intelligent Contracts | 0.0035 GEN | ~$0.00053 |
| **Follower Growth** | Track @GenLayer follower analytics | 0.0028 GEN | ~$0.00042 |
| **Mindshare Rankings** | Who dominates the @GenLayer conversation? | 0.0042 GEN | ~$0.00063 |

> 💡 **Note:** Gas fees are estimated at $0.15/GEN. Get free testnet GEN from [GenLayer Faucet](https://faucet.genlayer.com).

### 𝕏 X (Twitter) Integration
- Connect your X account to view personalized mindshare data
- Track your influence ranking in the GenLayer ecosystem
- View weekly mindshare trends and top topics

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [MetaMask](https://metamask.io/) browser extension
- GEN tokens for gas fees (get from [GenLayer Faucet](https://faucet.genlayer.com))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd socialpulse

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🔧 GenLayer Network Configuration

### Bradbury Testnet (Default - Recommended)

| Setting | Value |
|---------|-------|
| **Network Name** | GenLayer Bradbury Testnet |
| **Chain ID** | 4221 (0x107D) |
| **RPC URL** | https://rpc-bradbury.genlayer.com |
| **Currency Symbol** | GEN |
| **Block Explorer** | https://explorer-bradbury.genlayer.com |

> 💡 **Note:** When you first connect MetaMask, the app will automatically prompt you to add the GenLayer Bradbury Testnet.

### Studionet (Development)

| Setting | Value |
|---------|-------|
| **Network Name** | GenLayer Studionet |
| **Chain ID** | 61999 (0xF21F) |
| **RPC URL** | https://studio.genlayer.com/api |
| **Currency Symbol** | GEN |
| **Block Explorer** | https://genlayer-explorer.vercel.app |

### Asimov Testnet (Legacy)

| Setting | Value |
|---------|-------|
| **Network Name** | GenLayer Asimov Testnet |
| **Chain ID** | 4221 (0x107D) |
| **RPC URL** | https://rpc-asimov.genlayer.com |
| **Currency Symbol** | GEN |
| **Block Explorer** | https://explorer-asimov.genlayer.com |

## 📁 Project Structure

```
src/
├── components/
│   ├── App.tsx                 # Main application
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── ConnectPanel.tsx        # MetaMask & X connection panel
│   ├── GasConfirmModal.tsx     # Transaction signing modal
│   ├── DashboardOverview.tsx   # Main dashboard
│   ├── SearchPosts.tsx         # Post search
│   ├── FindPeople.tsx          # People discovery
│   ├── TwitterProfiles.tsx     # Profile viewer
│   ├── TweetTimeline.tsx       # Tweet timeline
│   ├── ProjectSentiment.tsx    # Sentiment analysis
│   ├── FollowerGrowth.tsx      # Growth analytics
│   └── MindshareRankings.tsx   # Mindshare leaderboard
├── services/
│   ├── metamask.ts             # MetaMask wallet integration
│   ├── genlayer.ts             # GenLayer SDK wrapper
│   └── xProfile.ts             # X profile management
├── data/
│   └── mockData.ts             # GenLayer ecosystem mock data
└── utils/
    └── format.ts               # Formatting utilities
```

## 🦊 MetaMask Integration

### Connecting Your Wallet

1. Click the **Connect** button in the top navigation
2. Approve the MetaMask connection request
3. If not on GenLayer network, the app will prompt to **add GenLayer Bradbury Testnet**
4. Click **Approve** in MetaMask to add the network
5. Your wallet is now connected to GenLayer!

### Adding Network Manually

If you need to add GenLayer Bradbury Testnet manually:

1. Open MetaMask → Settings → Networks → Add Network
2. Enter the following details:
   - **Network Name:** GenLayer Bradbury Testnet
   - **RPC URL:** https://rpc-bradbury.genlayer.com
   - **Chain ID:** 4221
   - **Currency Symbol:** GEN
   - **Block Explorer:** https://explorer-bradbury.genlayer.com
3. Click **Save**

### Signing Transactions

Every action that queries or modifies data requires a MetaMask signature:

1. Click an action button (Search, Load Timeline, etc.)
2. Review the transaction details in the confirmation modal
3. Click **"Sign with MetaMask"**
4. Confirm the signature in MetaMask popup
5. Wait for confirmation on GenLayer network

## 🔐 Security Notes

- Private keys are never stored in the application
- All signatures are handled securely via MetaMask
- Transaction history is stored locally in browser storage
- X profile connection is simulated (OAuth would be used in production)

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Blockchain**: GenLayer via `genlayer-js` SDK
- **Wallet**: MetaMask (EIP-1193)
- **Build**: Vite

## 📚 GenLayer Resources

- [GenLayer Documentation](https://docs.genlayer.com)
- [GenLayer Studio](https://studio.genlayer.com)
- [GenLayerJS SDK](https://docs.genlayer.com/api-references/genlayer-js)
- [GenLayer Faucet](https://faucet.genlayer.com)
- [GenLayer Twitter](https://x.com/GenLayer)

## 🔗 Contract Addresses

### Bradbury Testnet (Default)
- Consensus Main: `0xe66B434bc83805f380509642429eC8e43AE9874a`
- Staking: `0x4A4449E617F8D10FDeD0b461CadEf83939E821A5`

### Studionet
- Consensus Main: `0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575`

### Asimov Testnet
- Consensus Main: `0xe66B434bc83805f380509642429eC8e43AE9874a`
- Staking: `0x63Fa5E0bb10fb6fA98F44726C5518223F767687A`

## 🐦 X (Twitter) API — Live Data

By default, SocialPulse uses **mock data** for demonstration. To fetch **real posts** from X about @GenLayer, set up the included proxy server.

### Quick Setup

```bash
# 1. Install proxy server
cd server
npm install

# 2. Configure your X API key
cp .env.example .env
# Edit .env → set X_BEARER_TOKEN=your_token_here

# 3. Start proxy
npm start
# → Running on http://localhost:3001

# 4. Start frontend (in another terminal)
cd ..
VITE_X_API_PROXY_URL=http://localhost:3001 npm run dev
```

### Getting an X API Key

1. Go to [X Developer Portal](https://developer.x.com/en/portal/dashboard)
2. Create a project → Generate **Bearer Token**
3. Paste into `server/.env`

> **Pricing (2026):** X API uses pay-per-use (~$0.005/read). No free read tier.
>
> **Cheaper alternatives:**
> - [TwitterAPI.io](https://twitterapi.io) — $0.00015/read
> - [GetXAPI](https://getxapi.com) — $0.05/1000 tweets
>
> Set `X_API_BASE_URL` in `.env` to use alternatives.

### Proxy Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/x/search?q=@GenLayer` | Search tweets mentioning @GenLayer |
| `GET /api/x/user/:username` | Get user profile |
| `GET /api/x/user/:username/tweets` | Get user's recent tweets |
| `GET /api/x/health` | Health check + API status |

### How It Works

```
Frontend (React) → Proxy Server (Node.js) → X API v2
                   ↑                         ↑
              Your server              Bearer Token
              localhost:3001           (your API key)
```

The frontend never touches API keys directly. The proxy server stores your Bearer Token securely and forwards requests to the X API.

When no proxy is configured, the app shows **📦 Demo Mode** and uses mock data.

## 🔄 Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for the <a href="https://genlayer.com">GenLayer</a> ecosystem
</p>
