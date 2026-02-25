import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  Play,
  Square,
  RefreshCw,
  Zap,
  ZapOff,
  Trophy,
  Clock,
  Activity,
  BookOpen,
  SkipForward,
  Star,
} from "lucide-react";

export default function RoundControl() {
  const {
    teams,
    currentRound,
    buzzerEvents,
    startRound,
    activateBuzzers,
    resetRound,
    endRound,
    awardPoints,
    nextQuestion,
  } = useApp();

  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    teams.map((t) => t.id)
  );
  const [enableTopicSelection, setEnableTopicSelection] = useState(false);
  const [awardAmount, setAwardAmount] = useState(1);

  const toggleTeam = (id: string) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams.map((t) => t.id));
    }
  };

  const firstTeam = currentRound?.first_team_id
    ? teams.find((t) => t.id === currentRound.first_team_id)
    : null;

  const sortedEvents = [...buzzerEvents].sort(
    (a, b) => a.position - b.position
  );

  const handleAwardPoints = async (teamId: string) => {
    await awardPoints(teamId, awardAmount);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left: Round setup & controls */}
      <div className="space-y-5">
        {/* Current state */}
        <div
          className="bg-[#141b24] border rounded-xl p-5"
          style={{
            borderColor: currentRound
              ? currentRound.state === "active"
                ? "rgba(0,255,136,0.2)"
                : "rgba(0,217,255,0.2)"
              : "rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-white">Round Status</h3>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-mono font-bold"
              style={{
                background: currentRound
                  ? currentRound.state === "active"
                    ? "rgba(0,255,136,0.1)"
                    : "rgba(0,217,255,0.1)"
                  : "rgba(255,182,39,0.1)",
                color: currentRound
                  ? currentRound.state === "active"
                    ? "#00ff88"
                    : "#00d9ff"
                  : "#ffb627",
              }}
            >
              {currentRound
                ? currentRound.state.replace("_", " ").toUpperCase()
                : "IDLE"}
            </div>
          </div>

          {!currentRound ? (
            <p className="text-slate-500 text-sm">No active round. Configure and start below.</p>
          ) : (
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Teams:</span>
                <span className="text-white">{currentRound.participating_team_ids.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Question #:</span>
                <span className="text-[#00d9ff] font-bold">{currentRound.question_number || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Buzzers:</span>
                <span style={{ color: currentRound.buzzers_active ? "#00ff88" : "#ffb627" }}>
                  {currentRound.buzzers_active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">First buzz:</span>
                <span className="text-white">{firstTeam?.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Buzz count:</span>
                <span className="text-white">{buzzerEvents.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="bg-[#141b24] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Round Controls</h3>
          <div className="space-y-3">
            {!currentRound ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startRound(selectedTeams, enableTopicSelection)}
                disabled={selectedTeams.length === 0}
                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                style={{
                  background: selectedTeams.length > 0 ? "linear-gradient(135deg, #00ff88, #00bb65)" : "rgba(255,255,255,0.05)",
                  color: selectedTeams.length > 0 ? "#0a0e14" : "#64748b",
                  border: `2px solid ${selectedTeams.length > 0 ? "#00ff88" : "transparent"}`,
                  boxShadow: selectedTeams.length > 0 ? "0 0 30px rgba(0,255,136,0.3)" : "none",
                  cursor: selectedTeams.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <Play className="w-5 h-5" />
                Start Round
              </motion.button>
            ) : (
              <>
                {currentRound.state === "topic_selection" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={activateBuzzers}
                    className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #00d9ff, #0099bb)",
                      color: "#0a0e14",
                      border: "2px solid #00d9ff",
                      boxShadow: "0 0 25px rgba(0,217,255,0.3)",
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    Activate Buzzers
                  </motion.button>
                )}

                {/* Next Question button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextQuestion}
                  className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#00d9ff]/40 text-[#00d9ff] hover:bg-[#00d9ff]/10 transition-all"
                >
                  <SkipForward className="w-4 h-4" />
                  Next Question (Q{(currentRound.question_number || 1) + 1})
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetRound}
                    className="py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-[#ffb627]/40 text-[#ffb627] hover:bg-[#ffb627]/10 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={endRound}
                    className="py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Square className="w-4 h-4" />
                    End Round
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Award Points (during active round) */}
        {currentRound && (
          <div className="bg-[#141b24] border border-[#ffb627]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-[#ffb627]" />
              <h3 className="text-sm font-semibold text-white">Award Points</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-slate-400">Points:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 5, 10].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAwardAmount(v)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{
                      background: awardAmount === v ? "rgba(255,182,39,0.2)" : "rgba(255,255,255,0.04)",
                      color: awardAmount === v ? "#ffb627" : "#64748b",
                      border: `1px solid ${awardAmount === v ? "rgba(255,182,39,0.4)" : "transparent"}`,
                    }}
                  >
                    +{v}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {teams
                .filter((t) => currentRound.participating_team_ids.includes(t.id))
                .map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0e14]/50 border border-white/4"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: team.color }}
                    />
                    <span className="text-white text-sm flex-1">{team.name}</span>
                    <span className="text-[#ffb627] font-mono text-sm font-bold mr-2">
                      {team.points || 0} pts
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAwardPoints(team.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-[#ffb627]/10 border border-[#ffb627]/30 text-[#ffb627] hover:bg-[#ffb627]/20 transition-all"
                    >
                      +{awardAmount}
                    </motion.button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Team selection (only when no round) */}
        {!currentRound && (
          <div className="bg-[#141b24] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Select Teams</h3>
              <button
                onClick={toggleAll}
                className="text-xs font-mono text-[#00d9ff] hover:text-white transition-colors"
              >
                {selectedTeams.length === teams.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {teams.map((team) => {
                const isSelected = selectedTeams.includes(team.id);
                return (
                  <button
                    key={team.id}
                    onClick={() => toggleTeam(team.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                    style={{
                      background: isSelected ? `${team.color}08` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? `${team.color}30` : "transparent"}`,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? team.color : "transparent",
                        border: `2px solid ${isSelected ? team.color : "#475569"}`,
                      }}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-[#0a0e14]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: team.color }}
                    />
                    <span className="text-white text-sm flex-1">{team.name}</span>
                    <span className="text-[#ffb627] text-xs font-mono font-bold">{team.points || 0} pts</span>
                    <span className="text-slate-600 text-xs font-mono">{team.code}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-4">
              <button
                onClick={() => setEnableTopicSelection(!enableTopicSelection)}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-all"
                style={{
                  background: enableTopicSelection ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${enableTopicSelection ? "rgba(168,85,247,0.3)" : "transparent"}`,
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: enableTopicSelection ? "#a855f7" : "transparent",
                    border: `2px solid ${enableTopicSelection ? "#a855f7" : "#475569"}`,
                  }}
                >
                  {enableTopicSelection && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <BookOpen className="w-4 h-4 text-purple-400" />
                <div className="flex-1 text-left">
                  <p className="text-white text-sm">Enable Topic Selection</p>
                  <p className="text-slate-500 text-xs">Teams pick topics before buzzers activate</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Live buzzer monitor */}
      <div className="bg-[#141b24] border border-white/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-4 h-4 text-[#00d9ff]" />
          <h3 className="text-sm font-semibold text-white">Live Buzzer Monitor</h3>
          {currentRound && (
            <span className="text-xs font-mono text-slate-500 ml-1">
              Q{currentRound.question_number || 1}
            </span>
          )}
          {currentRound?.buzzers_active && (
            <motion.div
              className="ml-auto flex items-center gap-1.5"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
              <span className="text-xs font-mono text-[#00ff88]">LIVE</span>
            </motion.div>
          )}
        </div>

        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            {currentRound?.buzzers_active ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-12 h-12 text-[#00d9ff]/40 mb-3" />
                </motion.div>
                <p className="text-slate-400 text-sm">Waiting for buzzer presses...</p>
              </>
            ) : (
              <>
                <ZapOff className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-slate-600 text-sm">Buzzers are inactive</p>
                <p className="text-slate-700 text-xs mt-1">Start a round to monitor events</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedEvents.map((event, i) => {
              const team = teams.find((t) => t.id === event.team_id);
              const isFirst = event.position === 1;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="flex items-center gap-4 p-4 rounded-xl relative overflow-hidden"
                  style={{
                    background: isFirst
                      ? "rgba(0,255,136,0.06)"
                      : i % 2 === 0
                      ? "rgba(255,255,255,0.025)"
                      : "transparent",
                    border: isFirst
                      ? "1px solid rgba(0,255,136,0.25)"
                      : "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {isFirst && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, rgba(0,255,136,0.04) 0%, transparent 100%)",
                      }}
                    />
                  )}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold font-mono text-sm flex-shrink-0 relative z-10"
                    style={{
                      background: isFirst
                        ? "linear-gradient(135deg, #00ff88, #00cc6e)"
                        : "rgba(255,255,255,0.05)",
                      color: isFirst ? "#0a0e14" : "#64748b",
                      boxShadow: isFirst ? "0 0 15px rgba(0,255,136,0.4)" : "none",
                    }}
                  >
                    {isFirst ? <Trophy className="w-4 h-4" /> : `#${event.position}`}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: team?.color || "#64748b" }}
                  />
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-white text-sm font-bold">
                      {team?.name}
                      {isFirst && (
                        <span className="ml-2 text-[10px] font-mono text-[#00ff88] uppercase tracking-widest">
                          First
                        </span>
                      )}
                    </p>
                    <p className="text-slate-600 text-xs font-mono">{team?.code}</p>
                  </div>
                  <div className="text-right flex-shrink-0 relative z-10">
                    <p className="text-xs font-mono text-slate-300">
                      {new Date(event.pressed_at).toLocaleTimeString("en-US", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                    <p className="text-[10px] font-mono text-slate-600">
                      .{new Date(event.pressed_at).getMilliseconds().toString().padStart(3, "0")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
