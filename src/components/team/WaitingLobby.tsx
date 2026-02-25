import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Wifi, WifiOff, Clock, Users, LogOut, Activity, Star, Trophy } from "lucide-react";

export default function WaitingLobby() {
  const { user, teams, currentRound, logout } = useApp();
  const team = user?.team;

  const participatingTeams = currentRound
    ? teams.filter((t) => currentRound.participating_team_ids.includes(t.id))
    : teams;

  const sortedByPoints = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

  const getRoundStatus = () => {
    if (!currentRound) return { label: "Waiting for Round", color: "#ffb627" };
    if (currentRound.state === "topic_selection")
      return { label: "Topic Selection Active", color: "#00d9ff" };
    if (currentRound.state === "active")
      return { label: "Round Active", color: "#00ff88" };
    return { label: "Waiting for Round", color: "#ffb627" };
  };

  const status = getRoundStatus();

  return (
    <div className="min-h-screen bg-[#0a0e14] relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${team?.color || "#00d9ff"}20`, border: `1px solid ${team?.color || "#00d9ff"}40` }}
          >
            <Activity className="w-4 h-4" style={{ color: team?.color || "#00d9ff" }} />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {team?.name || "Unknown Team"}
            </h1>
            <p className="text-slate-500 text-xs font-mono">CODE: {team?.code}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-[#00ff88]">CONNECTED</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-mono transition-all"
          >
            <LogOut className="w-3 h-3" />
            Exit
          </button>
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6">
        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border mb-6"
            style={{
              borderColor: `${status.color}40`,
              background: `${status.color}10`,
              boxShadow: `0 0 20px ${status.color}15`,
            }}
          >
            <motion.span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: status.color }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: status.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {status.label}
            </span>
          </div>

          <h2 className="text-6xl font-extrabold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Waiting Lobby
          </h2>
          <p className="text-slate-400 text-lg">
            Stand by — the admin will start the round shortly
          </p>
        </motion.div>

        {/* Animated waiting indicator */}
        {!currentRound && (
          <motion.div className="mb-12 relative">
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                border: "2px solid rgba(255,182,39,0.2)",
                boxShadow: "0 0 60px rgba(255,182,39,0.1)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-[#ffb627]/20"
                  style={{ width: 80 + i * 40, height: 80 + i * 40 }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
              <Clock className="w-12 h-12 text-[#ffb627]/60" />
            </div>
          </motion.div>
        )}

        {/* Points Leaderboard */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#ffb627]" />
            <span className="text-xs font-mono text-[#ffb627] uppercase tracking-widest">
              Points Leaderboard
            </span>
          </div>
          <div className="bg-[#141b24] border border-[#ffb627]/15 rounded-xl p-4">
            {sortedByPoints.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-4">No teams yet</p>
            ) : (
              <div className="space-y-2">
                {sortedByPoints.map((t, i) => {
                  const isTop = i === 0 && (t.points || 0) > 0;
                  const isMe = t.id === team?.id;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: isMe ? `${t.color}08` : isTop ? "rgba(255,182,39,0.05)" : "transparent",
                        border: isMe ? `1px solid ${t.color}30` : isTop ? "1px solid rgba(255,182,39,0.15)" : "1px solid transparent",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                        style={{
                          background: isTop ? "#ffb627" : "rgba(255,255,255,0.05)",
                          color: isTop ? "#0a0e14" : "#64748b",
                        }}
                      >
                        {isTop ? <Trophy className="w-3.5 h-3.5" /> : `#${i + 1}`}
                      </div>
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: t.color }}
                      />
                      <span className="text-white text-sm font-semibold flex-1">{t.name}</span>
                      {isMe && (
                        <span className="text-[9px] font-mono bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/20 px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                      <span className="text-lg font-bold font-mono" style={{ color: isTop ? "#ffb627" : "#94a3b8" }}>
                        {t.points || 0}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">pts</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Teams status */}
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              {currentRound ? "Participating Teams" : "All Teams"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {participatingTeams.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#141b24] border rounded-xl p-4 flex items-center gap-3"
                style={{
                  borderColor: t.id === team?.id ? `${t.color}60` : "rgba(255,255,255,0.06)",
                  background: t.id === team?.id ? `${t.color}08` : "#141b24",
                  boxShadow: t.id === team?.id ? `0 0 20px ${t.color}10` : "none",
                }}
              >
                <div className="relative">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: t.color }}
                  />
                  {t.is_online && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: t.color }}
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{t.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {t.is_online ? (
                      <>
                        <Wifi className="w-3 h-3 text-[#00ff88]" />
                        <span className="text-[10px] font-mono text-[#00ff88]">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] font-mono text-slate-600">Offline</span>
                      </>
                    )}
                  </div>
                </div>
                {t.id === team?.id && (
                  <span className="text-[9px] font-mono bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/20 px-1.5 py-0.5 rounded">
                    YOU
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
