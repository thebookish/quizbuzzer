import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Zap,
  Users,
  BookOpen,
  History,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

type AdminTab =
  | "dashboard"
  | "round"
  | "teams"
  | "topics"
  | "history";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "round", label: "Round Control", icon: <Zap className="w-4 h-4" /> },
  { id: "teams", label: "Teams", icon: <Users className="w-4 h-4" /> },
  { id: "topics", label: "Topic Library", icon: <BookOpen className="w-4 h-4" /> },
  { id: "history", label: "Round History", icon: <History className="w-4 h-4" /> },
];

import DashboardOverview from "./DashboardOverview";
import RoundControl from "./RoundControl";
import TeamManagement from "./TeamManagement";
import TopicLibrary from "./TopicLibrary";
import RoundHistory from "./RoundHistory";

export default function AdminDashboard() {
  const { logout } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "round":
        return <RoundControl />;
      case "teams":
        return <TeamManagement />;
      case "topics":
        return <TopicLibrary />;
      case "history":
        return <RoundHistory />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Sidebar */}
      <aside className="relative z-20 hidden lg:flex w-64 flex-col bg-[#0d1219] border-r border-white/5 min-h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/30 flex items-center justify-center"
              style={{ boxShadow: "0 0 15px rgba(0,217,255,0.1)" }}
            >
              <Zap className="w-4 h-4 text-[#00d9ff]" />
            </div>
            <div>
              <p
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                BUZZR
              </p>
              <p className="text-[#00d9ff]/50 text-[10px] font-mono uppercase tracking-widest">
                Admin Control
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative"
              style={{
                background: activeTab === item.id ? "rgba(0,217,255,0.08)" : "transparent",
                color: activeTab === item.id ? "#00d9ff" : "rgba(255,255,255,0.5)",
                border: activeTab === item.id ? "1px solid rgba(0,217,255,0.2)" : "1px solid transparent",
              }}
            >
              <span className={activeTab === item.id ? "text-[#00d9ff]" : "text-slate-500 group-hover:text-slate-300 transition-colors"}>
                {item.icon}
              </span>
              <span className="font-medium group-hover:text-white transition-colors">
                {item.label}
              </span>
              {activeTab === item.id && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-[#0d1219] border-r border-white/5 flex flex-col lg:hidden"
          >
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#00d9ff]" />
                <span className="text-white font-bold text-sm">BUZZR Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    background: activeTab === item.id ? "rgba(0,217,255,0.08)" : "transparent",
                    color: activeTab === item.id ? "#00d9ff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0e14]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1
                className="text-white font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-[#00ff88]">System Online</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
