import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Zap,
  BookOpen,
  Activity,
  Wifi,
  WifiOff,
  Lock,
  CheckCircle,
  Clock,
  Trophy,
  Star,
} from "lucide-react";

export default function DashboardOverview() {
  const { teams, topics, currentRound, buzzerEvents, roundHistory } = useApp();

  const onlineTeams = teams.filter((t) => t.is_online).length;
  const firstTeam = currentRound?.first_team_id
    ? teams.find((t) => t.id === currentRound.first_team_id)
    : null;

  const sortedByPoints = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

  const statCards = [
    {
      label: "Active Teams",
      value: `${onlineTeams}/${teams.length}`,
      icon: <Users className="w-5 h-5" />,
      color: "#00d9ff",
      sub: "teams online",
    },
    {
      label: "Round Status",
      value: currentRound
        ? currentRound.state === "active"
          ? "LIVE"
          : currentRound.state.replace("_", " ").toUpperCase()
        : "IDLE",
      icon: <Zap className="w-5 h-5" />,
      color: currentRound?.state === "active" ? "#00ff88" : "#ffb627",
      sub: currentRound ? `Q${currentRound.question_number || 1} in progress` : "No active round",
    },
    {
      label: "Topics",
      value: topics.length,
      icon: <BookOpen className="w-5 h-5" />,
      color: "#a855f7",
      sub: "available topics",
    },
    {
      label: "Rounds Played",
      value: roundHistory.length,
      icon: <HistoryIcon className="w-5 h-5" />,
      color: "#ffb627",
      sub: "total rounds",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="bg-[#141b24] border rounded-xl p-5 transition-all"
            style={{
              borderColor: `${stat.color}20`,
              boxShadow: `0 0 0 0 ${stat.color}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${stat.color}40`;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 30px ${stat.color}10`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${stat.color}20`;
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
            <p
              className="text-3xl font-bold text-white mb-1 font-mono"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Points Leaderboard */}
      <div
        className="bg-[#141b24] border border-[#ffb627]/15 rounded-xl p-5"
        style={{ boxShadow: "0 0 30px rgba(255,182,39,0.04)" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Star className="w-4 h-4 text-[#ffb627]" />
          <h3 className="text-sm font-semibold text-white">Points Leaderboard</h3>
        </div>
        {sortedByPoints.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-8">No teams yet</p>
        ) : (
          <div className="space-y-2">
            {sortedByPoints.map((team, i) => {
              const isTop = i === 0 && (team.points || 0) > 0;
              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    background: isTop ? "rgba(255,182,39,0.06)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    border: isTop ? "1px solid rgba(255,182,39,0.2)" : "1px solid transparent",
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
                    style={{ background: team.color }}
                  />
                  <span className="text-white text-sm font-semibold flex-1">{team.name}</span>
                  <span
                    className="text-lg font-bold font-mono"
                    style={{ color: isTop ? "#ffb627" : "#94a3b8" }}
                  >
                    {team.points || 0}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">pts</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Teams grid + buzzer feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Teams status */}
        <div
          className="bg-[#141b24] border border-white/5 rounded-xl p-5"
          style={{ boxShadow: "0 0 30px rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Team Status</h3>
          </div>
          {teams.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">No teams registered yet</p>
          ) : (
            <div className="space-y-3">
              {teams.map((team, i) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0e14]/50 border border-white/4"
                >
                  <div className="relative">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: team.color }}
                    />
                    {team.is_online && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: team.color }}
                        animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{team.name}</p>
                    <p className="text-slate-600 text-xs font-mono">{team.code}</p>
                  </div>
                  <span className="text-[#ffb627] text-xs font-mono font-bold">{team.points || 0}pts</span>
                  <div className="flex items-center gap-2">
                    {team.is_locked && (
                      <Lock className="w-3.5 h-3.5 text-[#ffb627]" />
                    )}
                    {team.is_online ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#00ff88]">
                        <Wifi className="w-3 h-3" />
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
                        <WifiOff className="w-3 h-3" />
                        Offline
                      </span>
                    )}
                  </div>
                  {/* Buzzer position badge */}
                  {currentRound && buzzerEvents.find((e) => e.team_id === team.id) && (
                    <div
                      className="px-2 py-0.5 rounded-md text-xs font-mono font-bold"
                      style={{
                        background:
                          buzzerEvents.find((e) => e.team_id === team.id)?.position === 1
                            ? "rgba(0,255,136,0.15)"
                            : "rgba(255,182,39,0.1)",
                        color:
                          buzzerEvents.find((e) => e.team_id === team.id)?.position === 1
                            ? "#00ff88"
                            : "#ffb627",
                      }}
                    >
                      #{buzzerEvents.find((e) => e.team_id === team.id)?.position}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Live buzzer feed */}
        <div
          className="bg-[#141b24] border border-white/5 rounded-xl p-5"
          style={{ boxShadow: "0 0 30px rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Live Buzzer Feed</h3>
            {buzzerEvents.length > 0 && (
              <span className="ml-auto text-xs font-mono text-slate-500">
                {buzzerEvents.length} event{buzzerEvents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {buzzerEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Zap className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-slate-600 text-sm">No buzzer events yet</p>
              <p className="text-slate-700 text-xs mt-1">Events will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...buzzerEvents]
                .sort((a, b) => a.position - b.position)
                .map((event, i) => {
                  const team = teams.find((t) => t.id === event.team_id);
                  const isFirst = event.position === 1;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: isFirst
                          ? "rgba(0,255,136,0.05)"
                          : i % 2 === 0
                          ? "rgba(255,255,255,0.02)"
                          : "transparent",
                        border: isFirst ? "1px solid rgba(0,255,136,0.2)" : "1px solid transparent",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                        style={{
                          background: isFirst ? "#00ff88" : "#1a2030",
                          color: isFirst ? "#0a0e14" : "#64748b",
                        }}
                      >
                        {event.position === 1 ? (
                          <Trophy className="w-3.5 h-3.5" />
                        ) : (
                          `#${event.position}`
                        )}
                      </div>
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: team?.color || "#64748b" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-semibold">{team?.name}</p>
                      </div>
                      <p className="text-xs font-mono text-slate-500 flex-shrink-0">
                        {new Date(event.pressed_at).toLocaleTimeString("en-US", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Current round info */}
      {currentRound && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141b24] border border-[#00d9ff]/15 rounded-xl p-5"
          style={{ boxShadow: "0 0 30px rgba(0,217,255,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#00d9ff]" />
            <h3 className="text-sm font-semibold text-white">Current Round</h3>
            <div
              className="ml-auto px-3 py-1 rounded-full text-xs font-mono font-bold"
              style={{
                background:
                  currentRound.state === "active"
                    ? "rgba(0,255,136,0.1)"
                    : "rgba(0,217,255,0.1)",
                color:
                  currentRound.state === "active" ? "#00ff88" : "#00d9ff",
              }}
            >
              {currentRound.state.replace("_", " ").toUpperCase()}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Participating Teams
              </p>
              <p className="text-white font-mono font-bold">
                {currentRound.participating_team_ids.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Question #
              </p>
              <p className="text-[#00d9ff] font-mono font-bold">
                {currentRound.question_number || 1}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Buzzers Active
              </p>
              <div className="flex items-center gap-1.5">
                {currentRound.buzzers_active ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                    <span className="text-[#00ff88] font-mono text-sm">Yes</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 font-mono text-sm">No</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                First Buzzer
              </p>
              {firstTeam ? (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: firstTeam.color }}
                  />
                  <span className="text-white font-mono text-sm">{firstTeam.name}</span>
                </div>
              ) : (
                <span className="text-slate-600 font-mono text-sm">—</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
