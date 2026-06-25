import { useState, useEffect } from "react";
import { Wallet, Copy, CheckCircle2, LogOut, Globe, Activity, X, Link2, AlertTriangle, ExternalLink } from "lucide-react";
import {
  isMetaMaskInstalled,
  connectMetaMask,
  switchToGenLayerChain,
  getConnectedAccount,
  disconnectWallet,
  onAccountsChanged,
  onChainChanged,
  getTransactionHistory,
  getNetworkStatusSync,
  GENLAYER_CHAINS,
  type MetaMaskAccount,
} from "../services/genlayer";
import {
  getStoredXProfile,
  connectXProfile,
  disconnectXProfile,
} from "../services/xProfile";
import type { XProfile } from "../services/xProfile";

interface ConnectPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountChange: () => void;
}

export default function ConnectPanel({ isOpen, onClose, onAccountChange }: ConnectPanelProps) {
  const [account, setAccount] = useState<MetaMaskAccount | null>(null);
  const [xProfile, setXProfile] = useState<XProfile | null>(null);
  const [xHandleInput, setXHandleInput] = useState("");
  const [showXConnect, setShowXConnect] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [tab, setTab] = useState<"wallet" | "x" | "history">("wallet");

  const networkStatus = getNetworkStatusSync();
  const txHistory = getTransactionHistory();
  const metamaskInstalled = isMetaMaskInstalled();

  useEffect(() => {
    // Load initial state
    const loadAccount = async () => {
      const acc = await getConnectedAccount();
      setAccount(acc);
    };
    loadAccount();
    setXProfile(getStoredXProfile());

    // Listen for account/chain changes
    const unsubAccounts = onAccountsChanged(async () => {
      const acc = await getConnectedAccount();
      setAccount(acc);
      onAccountChange();
    });
    const unsubChain = onChainChanged(async () => {
      const acc = await getConnectedAccount();
      setAccount(acc);
      onAccountChange();
    });

    return () => {
      unsubAccounts();
      unsubChain();
    };
  }, [onAccountChange]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setError("");
    setIsConnecting(true);
    try {
      const acc = await connectMetaMask();
      setAccount(acc);
      
      // If not on GenLayer network, prompt to switch to Bradbury Testnet
      if (!acc.network) {
        await switchToGenLayerChain("testnetBradbury");
        const updatedAcc = await getConnectedAccount();
        setAccount(updatedAcc);
      }
      
      onAccountChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    setError("");
    try {
      await switchToGenLayerChain("testnetBradbury");
      const acc = await getConnectedAccount();
      setAccount(acc);
      onAccountChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch network");
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setAccount(null);
    setXProfile(null);
    onAccountChange();
  };

  const handleConnectX = () => {
    if (!xHandleInput.trim()) return;
    const profile = connectXProfile(xHandleInput.trim());
    setXProfile(profile);
    setShowXConnect(false);
    setXHandleInput("");
    onAccountChange();
  };

  const handleDisconnectX = () => {
    disconnectXProfile();
    setXProfile(null);
    onAccountChange();
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mt-16 mr-4 w-full max-w-md rounded-2xl border border-white/10 bg-dark-900 shadow-2xl shadow-black/40 animate-fade-in overflow-hidden max-h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <h3 className="font-semibold text-white">Wallet & Connection</h3>
          <button onClick={onClose} className="text-dark-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {(["wallet", "x", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${tab === t ? "text-brand-400 border-b-2 border-brand-400" : "text-dark-500 hover:text-dark-300"}`}
            >
              {t === "wallet" ? "🦊 MetaMask" : t === "x" ? "𝕏 Profile" : "📋 History"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-14rem)] p-4">
          {/* ── Wallet Tab ── */}
          {tab === "wallet" && (
            <div className="space-y-4">
              {/* Network Status */}
              <div className="rounded-lg border border-white/5 bg-dark-800/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-white">
                    <Globe size={12} className="text-brand-400" /> Network
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${account?.network ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                    <span className={`text-[10px] ${account?.network ? "text-emerald-400" : "text-amber-400"}`}>
                      {account?.network ? "Connected" : "Not on GenLayer"}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex justify-between text-dark-500">
                    <span>Chain</span>
                    <span className="text-dark-300">{account?.network ? GENLAYER_CHAINS[account.network].chainName : networkStatus.network}</span>
                  </div>
                  <div className="flex justify-between text-dark-500">
                    <span>ID</span>
                    <span className="text-dark-300">{account?.network ? GENLAYER_CHAINS[account.network].chainIdDecimal : networkStatus.chainId}</span>
                  </div>
                  {account && (
                    <div className="flex justify-between text-dark-500 col-span-2">
                      <span>Balance</span>
                      <span className="text-dark-300">{account.balance} GEN</span>
                    </div>
                  )}
                </div>
              </div>

              {!metamaskInstalled ? (
                /* MetaMask not installed */
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                  <AlertTriangle size={28} className="text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-white mb-1">MetaMask Required</p>
                  <p className="text-[10px] text-dark-400 mb-3">Install MetaMask to connect your wallet</p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-medium text-dark-900 hover:bg-amber-400"
                  >
                    Install MetaMask <ExternalLink size={12} />
                  </a>
                </div>
              ) : account ? (
                <>
                  {/* Connected Account */}
                  <div className={`rounded-lg border p-4 ${account.network ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${account.network ? "text-emerald-400" : "text-amber-400"}`}>
                        <Wallet size={14} /> {account.network ? "Connected" : "Wrong Network"}
                      </span>
                      <button onClick={handleDisconnect} className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300">
                        <LogOut size={10} /> Disconnect
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-[11px] font-mono text-dark-200 bg-dark-800/50 rounded px-2 py-1 truncate">
                        {account.address}
                      </code>
                      <button onClick={copyAddress} className="text-dark-400 hover:text-white transition-colors">
                        {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Switch Network Button */}
                  {!account.network && (
                    <button
                      onClick={handleSwitchNetwork}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-xs font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500"
                    >
                      <Globe size={14} /> Switch to GenLayer Bradbury Testnet
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* Not Connected */}
                  <div className="rounded-lg border border-white/5 bg-dark-800/30 p-4 text-center">
                    <div className="text-3xl mb-2">🦊</div>
                    <p className="text-sm text-dark-300 mb-1">Connect MetaMask</p>
                    <p className="text-[10px] text-dark-500">Sign transactions on GenLayer network</p>
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-medium text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <span className="animate-pulse">Connecting...</span>
                    ) : (
                      <>
                        <Wallet size={16} /> Connect MetaMask
                      </>
                    )}
                  </button>

                  {error && <p className="text-[11px] text-rose-400 text-center">{error}</p>}
                </>
              )}

              {/* GenLayer Info */}
              <a
                href="https://studio.genlayer.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 transition-all hover:bg-violet-500/10"
              >
                <span className="text-xl">🧬</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">GenLayer Studio</p>
                  <p className="text-[9px] text-dark-400">Deploy & test Intelligent Contracts</p>
                </div>
                <ExternalLink size={12} className="text-dark-500" />
              </a>
            </div>
          )}

          {/* ── X Profile Tab ── */}
          {tab === "x" && (
            <div className="space-y-4">
              {xProfile ? (
                <>
                  <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-brand-400">
                        <Link2 size={14} /> X Account Connected
                      </span>
                      <button onClick={handleDisconnectX} className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300">
                        <LogOut size={10} /> Disconnect
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-800 text-2xl ring-2 ring-brand-500/20">
                        {xProfile.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{xProfile.name}</h4>
                        <p className="text-xs text-brand-400">{xProfile.handle}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-dark-800/50 p-2">
                        <p className="text-sm font-bold text-white">{(xProfile.followers / 1000).toFixed(1)}K</p>
                        <p className="text-[9px] text-dark-500">Followers</p>
                      </div>
                      <div className="rounded-lg bg-dark-800/50 p-2">
                        <p className="text-sm font-bold text-white">{xProfile.following}</p>
                        <p className="text-[9px] text-dark-500">Following</p>
                      </div>
                      <div className="rounded-lg bg-dark-800/50 p-2">
                        <p className="text-sm font-bold text-white">{(xProfile.tweets / 1000).toFixed(1)}K</p>
                        <p className="text-[9px] text-dark-500">Tweets</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-dark-500 text-center">View your mindshare in the Mindshare Rankings tab</p>
                </>
              ) : (
                <>
                  <div className="rounded-lg border border-white/5 bg-dark-800/30 p-4 text-center">
                    <span className="text-3xl block mb-2">𝕏</span>
                    <p className="text-sm text-dark-300 mb-1">Connect Your X Account</p>
                    <p className="text-[10px] text-dark-500">View your profile and mindshare rankings</p>
                  </div>

                  {!showXConnect ? (
                    <button onClick={() => setShowXConnect(true)} className="w-full flex items-center justify-center gap-2 rounded-lg bg-dark-800 py-2.5 text-xs font-medium text-white hover:bg-dark-700 transition-colors border border-white/10">
                      <Link2 size={14} /> Connect X Account
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <input type="text" value={xHandleInput} onChange={(e) => setXHandleInput(e.target.value)} placeholder="Enter your X handle (e.g. @yourhandle)" className="w-full rounded-lg border border-white/10 bg-dark-800/50 px-3 py-2.5 text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500/50" onKeyDown={(e) => e.key === "Enter" && handleConnectX()} />
                      <div className="flex gap-2">
                        <button onClick={() => setShowXConnect(false)} className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-dark-400 hover:bg-white/5">Cancel</button>
                        <button onClick={handleConnectX} disabled={!xHandleInput.trim()} className="flex-1 rounded-lg bg-brand-600 py-2 text-xs text-white hover:bg-brand-500 disabled:opacity-40">Connect</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── History Tab ── */}
          {tab === "history" && (
            <div className="space-y-2">
              {txHistory.length === 0 ? (
                <div className="rounded-lg border border-white/5 bg-dark-800/30 p-6 text-center">
                  <Activity size={24} className="text-dark-600 mx-auto mb-2" />
                  <p className="text-xs text-dark-400">No transactions yet</p>
                </div>
              ) : (
                txHistory.slice(0, 20).map((tx, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-dark-800/30 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">{tx.action}</span>
                      <span className={`text-[10px] ${tx.status === "confirmed" ? "text-emerald-400" : tx.status === "pending" ? "text-amber-400" : "text-rose-400"}`}>{tx.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-[9px] font-mono text-dark-500">{tx.hash.slice(0, 16)}...{tx.hash.slice(-6)}</code>
                      {tx.gasUsed && <span className="text-[9px] text-dark-500">{tx.gasUsed}</span>}
                    </div>
                    <p className="text-[9px] text-dark-600 mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
