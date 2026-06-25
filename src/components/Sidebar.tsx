import {
  LayoutDashboard,
  Search,
  Users,
  AtSign,
  BarChart3,
  TrendingUp,
  Award,
  Activity,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

export type TabId =
  | "dashboard"
  | "search"
  | "people"
  | "profiles"
  | "timeline"
  | "sentiment"
  | "growth"
  | "mindshare";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: TabId; icon: React.ReactNode; label: string; section?: string }[] = [
  { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Overview", section: "MAIN" },
  { id: "search", icon: <Search size={20} />, label: "Search Posts" },
  { id: "people", icon: <Users size={20} />, label: "Find People" },
  { id: "profiles", icon: <AtSign size={20} />, label: "Profiles", section: "TWITTER" },
  { id: "timeline", icon: <Activity size={20} />, label: "Timeline" },
  { id: "sentiment", icon: <BarChart3 size={20} />, label: "Sentiment", section: "ANALYTICS" },
  { id: "growth", icon: <TrendingUp size={20} />, label: "Follower Growth" },
  { id: "mindshare", icon: <Award size={20} />, label: "Mindshare" },
];

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5 bg-dark-950/80 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
          <Layers size={20} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-sm font-bold tracking-tight text-white block">SocialPulse</span>
            <span className="text-[9px] text-brand-400 font-medium">powered by GenLayer</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navItems.map((item, idx) => (
          <div key={item.id}>
            {item.section && !collapsed && (
              <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-dark-500 ${idx > 0 ? "mt-6" : ""}`}>
                {item.section}
              </p>
            )}
            {item.section && collapsed && idx > 0 && (
              <div className="mx-3 my-4 border-t border-white/5" />
            )}
            <button
              onClick={() => onTabChange(item.id)}
              className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-brand-600/20 text-brand-400 shadow-sm shadow-brand-500/10"
                  : "text-dark-400 hover:bg-white/5 hover:text-dark-200"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`shrink-0 transition-colors ${activeTab === item.id ? "text-brand-400" : "text-dark-500 group-hover:text-dark-300"}`}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          </div>
        ))}
      </nav>

      {/* GenLayer Badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400">GenLayer Bradbury Testnet</span>
          </div>
          <p className="text-[9px] text-dark-500">All actions are signed & verified on-chain</p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="border-t border-white/5 p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-dark-500 transition-colors hover:bg-white/5 hover:text-dark-300"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
