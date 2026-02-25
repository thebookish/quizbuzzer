import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { LogOut, Trophy, Clock, Star } from "lucide-react";

export default function BuzzerInterface() {
  const { user, teams, currentRound, buzzerEvents, pressBuzzer, logout } = useApp();
  const team = user?.team;
  const [pressed, setPressed] = useState(false);
  const [myEvent, setMyEvent] = useState<{ position: number; pressed_at: string } | null>(null);

  useEffect(() => {
    if (!currentRound?.buzzers_active) {
      setPressed(false);
      setMyEvent(null);
    }
  }, [currentRound?.buzzers_active, currentRound?.id, currentRound?.question_number]);

  useEffect(() => {
    if (team) {
      const event = buzzerEvents.find((e) => e.team_id === team.id);
      if (event) {
        setMyEvent({ position: event.position, pressed_at: event.pressed_at });
        setPressed(true);
      } else {
        setPressed(false);
        setMyEvent(null);
      }
    }
  }, [buzzerEvents, team]);

  const isFirst = myEvent?.position === 1;
  const isActive = currentRound?.buzzers_active && !pressed;
  const isLocked = team?.is_locked && !myEvent;

  const handlePress = () => {
    if (!team || pressed || isLocked || !isActive) return;
    pressBuzzer(team.id);
  };

  const totalBuzzed = buzzerEvents.length;
  const firstTeam = currentRound?.first_team_id
    ? teams.find((t) => t.id === currentRound.first_team_id)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0e14] relative overflow-hidden flex flex-col">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow behind buzzer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isFirst
            ? "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(0,255,136,0.08) 0%, transparent 70%)"
            : isActive
            ? `radial-gradient(ellipse 50% 40% at 50% 60%, ${team?.color || "#00d9ff"}08 0%, transparent 70%)`
            : "none",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: team?.color || "#00d9ff", boxShadow: `0 0 10px ${team?.color || "#00d9ff"}` }}
          />
          <span
            className="text-white font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {team?.name}
          </span>
          <span className="text-slate-600 font-mono text-xs">#{team?.code}</span>
        </div>

        <div className="flex items-center gap-4">
          {currentRound && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b24] border border-[#00d9ff]/20">
              <span className="text-xs font-mono text-[#00d9ff] font-bold">Q{currentRound.question_number || 1}</span>
            </div>
          )}
          {team && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b24] border border-[#ffb627]/20">
              <Star className="w-3 h-3 text-[#ffb627]" />
              <span className="text-xs font-mono text-[#ffb627] font-bold">{team.points || 0} pts</span>
            </div>
          )}
          {totalBuzzed > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b24] border border-white/5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-xs font-mono text-slate-400">{totalBuzzed} buzzed</span>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white text-xs font-mono transition-all"
          >
            <LogOut className="w-3 h-3" />
            Exit
          </button>
        </div>
      </header>

      {/* Main buzzer area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
        {/* Status text */}
        <AnimatePresence mode="wait">
          {!myEvent && isActive && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 mb-4"
                animate={{ boxShadow: ["0 0 10px rgba(0,255,136,0.1)", "0 0 30px rgba(0,255,136,0.2)", "0 0 10px rgba(0,255,136,0.1)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-[#00ff88]"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[#00ff88] text-sm font-mono uppercase tracking-widest font-bold">
                  Buzzer Live
                </span>
              </motion.div>
              <p className="text-slate-400 text-lg">
                Press the buzzer as fast as you can!
              </p>
            </motion.div>
          )}

          {isFirst && (
            <motion.div
              key="first"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-10"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-16 h-16 text-[#00ff88] mx-auto mb-4" />
              </motion.div>
              <h2
                className="text-6xl font-extrabold text-[#00ff88] mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: "0 0 30px rgba(0,255,136,0.5)" }}
              >
                FIRST!
              </h2>
              <p className="text-[#00ff88]/60 text-lg font-mono">You buzzed first</p>
            </motion.div>
          )}

          {myEvent && !isFirst && (
            <motion.div
              key="ranked"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-10"
            >
              <div className="text-8xl font-extrabold text-[#ffb627] mb-2 font-mono">
                #{myEvent.position}
              </div>
              <p className="text-slate-400 text-lg">
                You buzzed {myEvent.position === 2 ? "second" : `${myEvent.position}th`}
              </p>
              {firstTeam && (
                <p className="text-slate-500 text-sm mt-2 font-mono">
                  {firstTeam.name} buzzed first
                </p>
              )}
            </motion.div>
          )}

          {!currentRound?.buzzers_active && !myEvent && (
            <motion.div
              key="standby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-12"
            >
              <p className="text-slate-500 text-xl mb-2">Buzzer is standby</p>
              <p className="text-slate-600 text-sm">Admin will activate the round</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* THE BUZZER BUTTON */}
        <div className="relative flex items-center justify-center">
          {/* Concentric rings */}
          {isActive && (
            <>
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border"
                  style={{
                    width: 280 + ring * 60,
                    height: 280 + ring * 60,
                    borderColor: `${team?.color || "#00d9ff"}${ring === 1 ? "30" : ring === 2 ? "18" : "0a"}`,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.3, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: ring * 0.3,
                  }}
                />
              ))}
            </>
          )}

          <motion.button
            onClick={handlePress}
            disabled={!isActive}
            whileTap={isActive ? { scale: [1, 1.15, 0.95, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="relative w-72 h-72 rounded-full select-none outline-none"
            style={{
              cursor: isActive ? "pointer" : "not-allowed",
            }}
          >
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isFirst
                  ? "radial-gradient(circle at 35% 30%, rgba(0,255,136,0.3), rgba(0,180,95,0.8))"
                  : myEvent
                  ? "radial-gradient(circle at 35% 30%, rgba(255,182,39,0.3), rgba(180,120,0,0.8))"
                  : isActive
                  ? `radial-gradient(circle at 35% 30%, ${team?.color || "#00d9ff"}60, ${team?.color || "#00d9ff"}cc)`
                  : "radial-gradient(circle at 35% 30%, rgba(30,40,55,0.8), rgba(20,27,36,0.95))",
                border: isActive
                  ? `3px solid ${team?.color || "#00d9ff"}`
                  : myEvent
                  ? `3px solid ${isFirst ? "#00ff88" : "#ffb627"}`
                  : "3px solid rgba(255,255,255,0.08)",
                boxShadow: isActive
                  ? `0 0 60px ${team?.color || "#00d9ff"}60, 0 0 120px ${team?.color || "#00d9ff"}20, inset 0 0 40px rgba(255,255,255,0.05)`
                  : isFirst
                  ? "0 0 60px rgba(0,255,136,0.5), 0 0 120px rgba(0,255,136,0.2)"
                  : myEvent
                  ? "0 0 40px rgba(255,182,39,0.4)"
                  : "0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            />

            {/* Shine overlay */}
            <div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.4) 0%, transparent 60%)",
              }}
            />

            {/* Button label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-extrabold tracking-widest"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: isActive ? "#0a0e14" : isFirst ? "#00ff88" : myEvent ? "#ffb627" : "rgba(255,255,255,0.2)",
                  textShadow: isActive ? "none" : "none",
                }}
              >
                {isFirst ? "🏆" : myEvent ? `#${myEvent.position}` : "BUZZ"}
              </span>
              {isActive && (
                <span
                  className="text-xs font-mono mt-1 opacity-60"
                  style={{ color: "#0a0e14" }}
                >
                  PRESS NOW
                </span>
              )}
            </div>
          </motion.button>
        </div>

        {/* Bottom status */}
        {pressed && myEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center"
          >
            <p className="text-slate-500 text-sm font-mono">
              Buzzed at{" "}
              <span className="text-slate-300">
                {new Date(myEvent.pressed_at).toLocaleTimeString("en-US", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </p>
            <p className="text-slate-600 text-xs mt-1">
              Waiting for admin to reset or end the round...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
