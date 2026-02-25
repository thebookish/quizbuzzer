import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { BookOpen, LogOut, ChevronRight } from "lucide-react";

export default function TopicSelectionScreen() {
  const { user, topics, currentRound, selectTopic, logout } = useApp();
  const team = user?.team;

  const handleSelectTopic = (topicId: string) => {
    if (team) {
      selectTopic(team.id, topicId);
    }
  };

  const categoryColors: Record<string, string> = {
    History: "#ffb627",
    Science: "#00d9ff",
    Entertainment: "#a855f7",
    Geography: "#00ff88",
    Sports: "#ff4757",
    Default: "#64748b",
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#00d9ff]" />
          <span
            className="text-white font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Topic Selection
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white text-xs font-mono transition-all"
        >
          <LogOut className="w-3 h-3" />
          Exit
        </button>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d9ff]/30 bg-[#00d9ff]/10 mb-4"
            style={{ boxShadow: "0 0 20px rgba(0,217,255,0.1)" }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#00d9ff]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[#00d9ff] text-xs font-mono uppercase tracking-widest">
              Selection Active
            </span>
          </div>
          <h2
            className="text-5xl font-extrabold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Choose Your Topic
          </h2>
          <p className="text-slate-400">
            Select the topic your team wants to answer questions about
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {topics.map((topic, i) => {
            const color =
              categoryColors[topic.category || ""] || categoryColors.Default;
            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectTopic(topic.id)}
                className="relative bg-[#141b24] border rounded-2xl p-5 text-left transition-all group overflow-hidden"
                style={{
                  borderColor: `${color}30`,
                  boxShadow: `0 0 0 0 ${color}00`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${color}20`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}30`;
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5"
                  style={{ background: color }}
                />
                <div
                  className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest mb-3"
                  style={{ background: `${color}15`, color }}
                >
                  {topic.category || "General"}
                </div>
                <h3
                  className="text-white font-bold text-base mb-2 leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {topic.title}
                </h3>
                {topic.description && (
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {topic.description}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono" style={{ color }}>
                    Select
                  </span>
                  <ChevronRight className="w-3 h-3" style={{ color }} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
