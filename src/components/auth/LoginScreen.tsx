import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Zap, Shield, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Check your email/team code and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-[ellipse_60%_40%_at_50%_50%] from-[#00d9ff]/5 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#00d9ff]/40 mb-6"
            style={{
              boxShadow: "0 0 40px rgba(0,217,255,0.2), inset 0 0 20px rgba(0,217,255,0.05)",
            }}
          >
            <Zap className="w-9 h-9 text-[#00d9ff]" />
          </motion.div>
          <h1
            className="text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            BUZZR
          </h1>
          <p className="text-[#00d9ff]/60 text-sm tracking-[0.3em] uppercase font-mono">
            Quiz Competition System
          </p>
        </div>

        {/* Form card */}
        <div
          className="bg-[#141b24] border border-[#00d9ff]/20 rounded-2xl p-8"
          style={{ boxShadow: "0 0 40px rgba(0,217,255,0.05)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-[#00d9ff]" />
            <span className="text-[#00d9ff] text-xs font-mono tracking-widest uppercase">
              Authentication
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                Team Code / Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ALPHA or admin@quiz.com"
                className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-[#00d9ff]/60 focus:ring-1 focus:ring-[#00d9ff]/30 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-[#00d9ff]/60 focus:ring-1 focus:ring-[#00d9ff]/30 transition-all pr-12"
                  required
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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.2em] transition-all relative overflow-hidden"
              style={{
                background: loading
                  ? "rgba(0,217,255,0.1)"
                  : "linear-gradient(135deg, #00d9ff, #0099bb)",
                color: loading ? "#00d9ff" : "#0a0e14",
                border: "2px solid #00d9ff",
                boxShadow: loading ? "none" : "0 0 20px rgba(0,217,255,0.4)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-[#00d9ff]/30 border-t-[#00d9ff] rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Access System"
              )}
            </motion.button>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-[#141b24]/60 border border-slate-700/30 rounded-xl p-4">
          <p className="text-xs font-mono text-slate-500 mb-2">How to login:</p>
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400">
              <span className="text-[#00d9ff]">Admin:</span> Use your admin email &amp; password
            </p>
            <p className="text-xs font-mono text-slate-400">
              <span className="text-[#00ff88]">Team:</span> Enter your team code &amp; password
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
