import { useState, useCallback, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import SearchPosts from "./components/SearchPosts";
import FindPeople from "./components/FindPeople";
import TwitterProfiles from "./components/TwitterProfiles";
import TweetTimeline from "./components/TweetTimeline";
import ProjectSentiment from "./components/ProjectSentiment";
import FollowerGrowth from "./components/FollowerGrowth";
import MindshareRankings from "./components/MindshareRankings";
import ConnectPanel from "./components/ConnectPanel";
import type { TabId } from "./components/Sidebar";
import { Bell, Search, Menu, X, Wallet, Layers, AlertTriangle } from "lucide-react";
import { 
  getConnectedAccount, 
  onAccountsChanged, 
  onChainChanged,
  isMetaMaskInstalled,
  type MetaMaskAccount 
} from "./services/genlayer";
import { getStoredXProfile } from "./services/xProfile";
import type { XProfile } from "./services/xProfile";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConnectPanel, setShowConnectPanel] = useState(false);
  const [account, setAccount] = useState<MetaMaskAccount | null>(null);
  const [xProfile, setXProfile] = useState<XProfile | null>(null);

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
    });
    const unsubChain = onChainChanged(async () => {
      const acc = await getConnectedAccount();
      setAccount(acc);
    });

    return () => {
      unsubAccounts();
      unsubChain();
    };
  }, []);

  const handleAccountChange = useCallback(async () => {
    const acc = await getConnectedAccount();
    setAccount(acc);
    setXProfile(getStoredXProfile());
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardOverview />;
      case "search": return <SearchPosts />;
      case "people": return <FindPeople />;
      case "profiles": return <TwitterProfiles />;
      case "timeline": return <TweetTimeline />;
      case "sentiment": return <ProjectSentiment />;
      case "growth": return <FollowerGrowth />;
      case "mindshare": return <MindshareRankings />;
      default: return <DashboardOverview />;
    }
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const metamaskInstalled = isMetaMaskInstalled();

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10">
            <Sidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-dark-950/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-dark-400 hover:bg-white/5 hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                <Layers size={16} />
              </div>
              <span className="text-sm font-semibold text-white">SocialPulse</span>
            </div>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={16} />
              <input
                type="text"
                placeholder="Quick search..."
                className="w-64 rounded-lg border border-white/5 bg-dark-900/40 py-2 pl-9 pr-4 text-xs text-white placeholder-dark-500 outline-none transition-all focus:border-brand-500/30 focus:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Network Badge */}
            {account?.network ? (
              <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 sm:flex">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-400">
                  {account.network === "testnetBradbury" ? "Bradbury" : account.network === "studionet" ? "Studionet" : "Asimov"}
                </span>
              </div>
            ) : account ? (
              <div className="hidden items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 sm:flex">
                <AlertTriangle size={10} className="text-amber-400" />
                <span className="text-[10px] font-medium text-amber-400">Wrong Network</span>
              </div>
            ) : null}

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-dark-400 transition-colors hover:bg-white/5 hover:text-white">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 animate-pulse-glow" />
            </button>

            {/* Connect Button */}
            <button
              onClick={() => setShowConnectPanel(true)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                account
                  ? account.network
                    ? "border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10"
                    : "border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10"
                  : metamaskInstalled
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500"
                  : "bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500"
              }`}
            >
              {metamaskInstalled ? <Wallet size={14} /> : <span>🦊</span>}
              {account ? (
                <span className="hidden sm:inline">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
              ) : (
                <span>{metamaskInstalled ? "Connect" : "Install"}</span>
              )}
            </button>

            {/* X Profile Avatar */}
            {xProfile ? (
              <button
                onClick={() => setShowConnectPanel(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm ring-2 ring-brand-500/20 transition-all hover:ring-brand-500/40"
                title={xProfile.handle}
              >
                {xProfile.avatar}
              </button>
            ) : (
              <button
                onClick={() => setShowConnectPanel(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-800 text-dark-500 ring-2 ring-white/5 hover:ring-white/10 transition-all"
                title="Connect X Account"
              >
                𝕏
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>

      {/* Connect Panel */}
      <ConnectPanel
        isOpen={showConnectPanel}
        onClose={() => setShowConnectPanel(false)}
        onAccountChange={handleAccountChange}
      />
    </div>
  );
}
