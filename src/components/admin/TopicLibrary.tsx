import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  X,
  Check,
  Tag,
  AlignLeft,
} from "lucide-react";

const CATEGORIES = [
  "History",
  "Science",
  "Entertainment",
  "Geography",
  "Sports",
  "Mathematics",
  "Literature",
  "Technology",
  "Art",
  "Other",
];

const categoryColors: Record<string, string> = {
  History: "#ffb627",
  Science: "#00d9ff",
  Entertainment: "#a855f7",
  Geography: "#00ff88",
  Sports: "#ff4757",
  Mathematics: "#00d9ff",
  Literature: "#f97316",
  Technology: "#00d9ff",
  Art: "#ec4899",
  Other: "#64748b",
};

interface TopicFormData {
  title: string;
  category: string;
  description: string;
}

export default function TopicLibrary() {
  const { topics, addTopic, updateTopic, deleteTopic } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TopicFormData>({
    title: "",
    category: "Science",
    description: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const openAdd = () => {
    setEditId(null);
    setFormData({ title: "", category: "Science", description: "" });
    setShowAdd(true);
  };

  const openEdit = (id: string) => {
    const topic = topics.find((t) => t.id === id);
    if (!topic) return;
    setEditId(id);
    setFormData({
      title: topic.title,
      category: topic.category || "Other",
      description: topic.description || "",
    });
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    if (editId) {
      updateTopic(editId, formData.title, formData.category, formData.description);
    } else {
      addTopic(formData.title, formData.category, formData.description);
    }
    setShowAdd(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTopic(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const allCategories = ["All", ...Array.from(new Set(topics.map((t) => t.category || "Other")))];
  const filteredTopics = filterCategory === "All"
    ? topics
    : topics.filter((t) => (t.category || "Other") === filterCategory);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Topic Library
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {topics.length} topics across {allCategories.length - 1} categories
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            color: "white",
            border: "2px solid #a855f7",
            boxShadow: "0 0 20px rgba(168,85,247,0.3)",
          }}
        >
          <Plus className="w-4 h-4" />
          New Topic
        </motion.button>
      </div>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-[#141b24] border border-purple-500/20 rounded-xl p-5 overflow-hidden"
            style={{ boxShadow: "0 0 30px rgba(168,85,247,0.06)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                {editId ? "Edit Topic" : "New Topic"}
              </h3>
              <button
                onClick={() => { setShowAdd(false); setEditId(null); }}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  <Tag className="w-3 h-3" />
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. World History"
                  className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const color = categoryColors[cat] || "#64748b";
                    const isSelected = formData.category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFormData((p) => ({ ...p, category: cat }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                        style={{
                          background: isSelected ? `${color}20` : "rgba(255,255,255,0.04)",
                          color: isSelected ? color : "#64748b",
                          border: `1px solid ${isSelected ? `${color}40` : "transparent"}`,
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  <AlignLeft className="w-3 h-3" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this topic..."
                  rows={2}
                  className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowAdd(false); setEditId(null); }}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white border border-slate-700/50 transition-all"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                style={{
                  background: formData.title.trim()
                    ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                    : "rgba(255,255,255,0.05)",
                  color: formData.title.trim() ? "white" : "#64748b",
                }}
              >
                <Check className="w-4 h-4" />
                {editId ? "Save Changes" : "Add Topic"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filter */}
      {allCategories.length > 2 && (
        <div className="flex gap-2 flex-wrap">
          {allCategories.map((cat) => {
            const color = cat === "All" ? "#64748b" : categoryColors[cat] || "#64748b";
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: isActive ? `${color}20` : "rgba(255,255,255,0.04)",
                  color: isActive ? color : "#64748b",
                  border: `1px solid ${isActive ? `${color}40` : "transparent"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Topics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTopics.map((topic, i) => {
          const color = categoryColors[topic.category || "Other"] || "#64748b";
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="bg-[#141b24] border rounded-xl p-5 group relative overflow-hidden transition-all"
              style={{ borderColor: `${color}20` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 30px ${color}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}20`;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-5"
                style={{ background: color }}
              />
              <div
                className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest mb-3"
                style={{ background: `${color}15`, color }}
              >
                {topic.category || "General"}
              </div>
              <h3
                className="text-white font-bold text-base mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {topic.title}
              </h3>
              {topic.description && (
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  {topic.description}
                </p>
              )}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openEdit(topic.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(topic.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                  style={{
                    border: deleteConfirm === topic.id ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    background: deleteConfirm === topic.id ? "rgba(239,68,68,0.1)" : "transparent",
                    color: deleteConfirm === topic.id ? "#ef4444" : "#64748b",
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                  {deleteConfirm === topic.id ? "Confirm" : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No topics found</p>
          <p className="text-slate-600 text-sm mt-1">
            {filterCategory !== "All" ? "Try a different filter or " : ""}Add your first topic
          </p>
        </div>
      )}
    </div>
  );
}
