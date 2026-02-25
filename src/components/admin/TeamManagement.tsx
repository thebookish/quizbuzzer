import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  Plus,
  Trash2,
  Lock,
  Unlock,
  Users,
  Wifi,
  WifiOff,
  X,
  Check,
  Eye,
  EyeOff,
  Key,
  Copy,
  CheckCheck,
} from "lucide-react";

const TEAM_COLORS = [
  "#00d9ff",
  "#00ff88",
  "#ffb627",
  "#ff4757",
  "#a855f7",
  "#f97316",
  "#ec4899",
  "#10b981",
];

export default function TeamManagement() {
  const { teams, addTeam, removeTeam, toggleTeamLock } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newColor, setNewColor] = useState(TEAM_COLORS[0]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newName.trim() || !newCode.trim() || !newPassword.trim()) return;
    setAdding(true);
    setAddError("");
    try {
      await addTeam(newName.trim(), newCode.trim().toUpperCase(), newColor, newPassword.trim());
      setNewName("");
      setNewCode("");
      setNewPassword("");
      setNewColor(TEAM_COLORS[0]);
      setShowAdd(false);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add team");
    } finally {
      setAdding(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      removeTeam(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Teams
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {teams.length} teams registered · {teams.filter((t) => t.is_online).length} online
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, #00d9ff, #0099bb)",
            color: "#0a0e14",
            border: "2px solid #00d9ff",
            boxShadow: "0 0 20px rgba(0,217,255,0.3)",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Team
        </motion.button>
      </div>

      {/* Add team form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-[#141b24] border border-[#00d9ff]/20 rounded-xl p-5 overflow-hidden"
            style={{ boxShadow: "0 0 30px rgba(0,217,255,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">New Team</h3>
              <button
                onClick={() => { setShowAdd(false); setAddError(""); }}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Team Alpha"
                  className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-[#00d9ff]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Team Code
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ALPHA"
                  maxLength={10}
                  className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-[#00d9ff]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Login Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Team login password"
                    className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-[#00d9ff]/50 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Color
                </label>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {TEAM_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex-shrink-0"
                      style={{
                        background: color,
                        border: newColor === color ? "2px solid white" : "2px solid transparent",
                        boxShadow: newColor === color ? `0 0 10px ${color}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {addError && (
              <p className="text-red-400 text-xs font-mono mb-4 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
                {addError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowAdd(false); setAddError(""); }}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white border border-slate-700/50 transition-all"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={!newName.trim() || !newCode.trim() || !newPassword.trim() || adding}
                className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                style={{
                  background:
                    newName.trim() && newCode.trim() && newPassword.trim() && !adding
                      ? "linear-gradient(135deg, #00d9ff, #0099bb)"
                      : "rgba(255,255,255,0.05)",
                  color:
                    newName.trim() && newCode.trim() && newPassword.trim() && !adding ? "#0a0e14" : "#64748b",
                }}
              >
                {adding ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Add Team
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teams list */}
      <div className="grid grid-cols-1 gap-3">
        {teams.map((team, i) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#141b24] border rounded-xl p-4 flex items-center gap-4 group transition-all"
            style={{
              borderColor: `${team.color}15`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${team.color}30`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${team.color}15`;
            }}
          >
            {/* Color swatch */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold font-mono text-sm"
              style={{ background: `${team.color}15`, color: team.color, border: `1px solid ${team.color}30` }}
            >
              {team.code.slice(0, 2)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-white font-bold text-base">{team.name}</h4>
                {team.is_locked && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#ffb627]/10 text-[#ffb627] border border-[#ffb627]/20">
                    LOCKED
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ffb627]/10 text-[#ffb627] border border-[#ffb627]/20 font-bold">
                  {team.points || 0} PTS
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Login info */}
                <div className="flex items-center gap-1.5 bg-[#0a0e14]/60 border border-white/5 rounded-md px-2 py-1">
                  <Key className="w-3 h-3 text-[#00d9ff]" />
                  <span className="text-xs font-mono text-[#00d9ff]">Code:</span>
                  <span className="text-xs font-mono text-white font-bold">{team.code}</span>
                  <button
                    onClick={() => copyToClipboard(team.code, `code-${team.id}`)}
                    className="text-slate-500 hover:text-white transition-colors ml-0.5"
                    title="Copy code"
                  >
                    {copiedId === `code-${team.id}` ? (
                      <CheckCheck className="w-3 h-3 text-[#00ff88]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {team.is_online ? (
                    <>
                      <Wifi className="w-3 h-3 text-[#00ff88]" />
                      <span className="text-xs font-mono text-[#00ff88]">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-slate-600" />
                      <span className="text-xs font-mono text-slate-600">Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTeamLock(team.id)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all border"
                style={{
                  background: team.is_locked ? "rgba(255,182,39,0.1)" : "rgba(255,255,255,0.04)",
                  borderColor: team.is_locked ? "rgba(255,182,39,0.3)" : "rgba(255,255,255,0.08)",
                  color: team.is_locked ? "#ffb627" : "#64748b",
                }}
                title={team.is_locked ? "Unlock team" : "Lock team"}
              >
                {team.is_locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(team.id)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all border"
                style={{
                  background:
                    deleteConfirm === team.id
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(255,255,255,0.04)",
                  borderColor:
                    deleteConfirm === team.id
                      ? "rgba(239,68,68,0.4)"
                      : "rgba(255,255,255,0.08)",
                  color: deleteConfirm === team.id ? "#ef4444" : "#64748b",
                }}
                title={deleteConfirm === team.id ? "Click again to confirm" : "Delete team"}
              >
                {deleteConfirm === team.id ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No teams yet</p>
          <p className="text-slate-600 text-sm mt-1">Add your first team to get started</p>
        </div>
      )}
    </div>
  );
}
