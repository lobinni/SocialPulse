# 🔧 X API Proxy Server

This is a simple proxy server that fetches real data from the X (Twitter) API v2 and serves it to the SocialPulse frontend.

## Why a Proxy?

The X API requires a **Bearer Token** for authentication. Browser-based apps cannot safely store API keys, so this server acts as a proxy — the frontend calls this server, and the server calls the X API with your token.

## Setup

### 1. Get an X API Key

1. Go to [X Developer Portal](https://developer.x.com/en/portal/dashboard)
2. Create a new project/app
3. Generate a **Bearer Token**
4. Copy the token

> ⚠️ As of 2026, X API uses **pay-per-use** pricing:
> - Post reads: ~$0.005 each
> - User lookups: ~$0.010 each
> - No free read tier available
>
> **Alternative**: Use [TwitterAPI.io](https://twitterapi.io) ($0.00015/read) or [GetXAPI](https://getxapi.com) ($0.05/1000 tweets)

### 2. Install & Run

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your Bearer Token
npm start
```

### 3. Configure Frontend

Set the proxy URL in the frontend:
```
VITE_X_API_PROXY_URL=http://localhost:3001
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/x/search?q=@GenLayer` | Search tweets mentioning @GenLayer |
| `GET /api/x/user/:username` | Get user profile |
| `GET /api/x/user/:username/tweets` | Get user's tweets |
| `GET /api/x/health` | Health check |
