import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  History,
  Trophy,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";

export default function RoundHistory() {
  const { teams, roundHistory } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (roundHistory.length === 0) {
    return (
      <div className="text-center py-24">
        <History className="w-16 h-16 text-slate-700 mx-auto mb-4" />
        <h3
          className="text-xl font-bold text-slate-500 mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          No History Yet
        </h3>
        <p className="text-slate-600 text-sm">
          Completed rounds will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Round History
        </h2>
        <p className="text-slate-500 text-sm">
          {roundHistory.length} round{roundHistory.length !== 1 ? "s" : ""} completed
        </p>
      </div>

      <div className="space-y-3">
        {roundHistory.map((entry, i) => {
          const isExpanded = expandedId === entry.round.id;
          const firstEvent = entry.events.find((e) => e.position === 1);
          const firstTeam = firstEvent
            ? teams.find((t) => t.id === firstEvent.team_id)
            : null;
          const participatingTeams = teams.filter((t) =>
            entry.round.participating_team_ids.includes(t.id)
          );

          return (
            <motion.div
              key={entry.round.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[#141b24] border border-white/5 rounded-xl overflow-hidden"
              style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
            >
              {/* Round header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.round.id)}
                className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm flex-shrink-0"
                  style={{ background: "rgba(0,217,255,0.08)", color: "#00d9ff", border: "1px solid rgba(0,217,255,0.15)" }}
                >
                  #{roundHistory.length - i}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-white font-semibold text-sm">
                      Round {roundHistory.length - i}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-400 border border-white/5">
                      COMPLETED
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.round.ended_at
                        ? new Date(entry.round.ended_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {participatingTeams.length} teams
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.events.length} buzz{entry.events.length !== 1 ? "es" : ""}
                    </span>
                  </div>
                </div>

                {/* Winner */}
                {firstTeam && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Trophy className="w-4 h-4 text-[#00ff88]" />
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: firstTeam.color }}
                      />
                      <span className="text-[#00ff88] text-sm font-semibold">
                        {firstTeam.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-slate-600 ml-2 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="p-5 space-y-4">
                      {/* Buzzer events table */}
                      {entry.events.length > 0 ? (
                        <div>
                          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                            Buzzer Events
                          </p>
                          <div className="space-y-2">
                            {[...entry.events]
                              .sort((a, b) => a.position - b.position)
                              .map((event) => {
                                const team = teams.find((t) => t.id === event.team_id);
                                const isFirst = event.position === 1;
                                return (
                                  <div
                                    key={event.id}
                                    className="flex items-center gap-3 p-3 rounded-lg"
                                    style={{
                                      background: isFirst
                                        ? "rgba(0,255,136,0.05)"
                                        : "rgba(255,255,255,0.02)",
                                      border: isFirst
                                        ? "1px solid rgba(0,255,136,0.2)"
                                        : "1px solid rgba(255,255,255,0.04)",
                                    }}
                                  >
                                    <div
                                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs flex-shrink-0"
                                      style={{
                                        background: isFirst ? "#00ff88" : "rgba(255,255,255,0.05)",
                                        color: isFirst ? "#0a0e14" : "#64748b",
                                      }}
                                    >
                                      {isFirst ? <Trophy className="w-3 h-3" /> : `#${event.position}`}
                                    </div>
                                    <div
                                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                      style={{ background: team?.color || "#64748b" }}
                                    />
                                    <span className="text-white text-sm flex-1">
                                      {team?.name || "Unknown"}
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">
                                      {new Date(event.pressed_at).toLocaleTimeString("en-US", {
                                        hour12: false,
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      })}
                                      <span className="text-slate-600">
                                        .{new Date(event.pressed_at).getMilliseconds().toString().padStart(3, "0")}
                                      </span>
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 text-sm text-center py-4">
                          No buzzer events recorded
                        </p>
                      )}

                      {/* Participating teams */}
                      <div>
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                          Participating Teams
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {participatingTeams.map((team) => (
                            <div
                              key={team.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
                              style={{
                                background: `${team.color}10`,
                                color: team.color,
                                border: `1px solid ${team.color}25`,
                              }}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: team.color }}
                              />
                              {team.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
