import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Compass, Music, Terminal, Code, Award, Sparkles, Send, FileText, ArrowRight, X } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface CommandPaletteProps {
  onToggleMusic: () => void;
  musicPlaying: boolean;
  onOpenChat: () => void;
}

export default function CommandPalette({ onToggleMusic, musicPlaying, onOpenChat }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const commands = [
    { id: "nav-home", title: "Scroll to Home", category: "Navigation", icon: Compass, action: () => scrollToSection("home") },
    { id: "nav-about", title: "Scroll to About", category: "Navigation", icon: Compass, action: () => scrollToSection("about") },
    { id: "nav-skills", title: "Scroll to Skills", category: "Navigation", icon: Code, action: () => scrollToSection("skills") },
    { id: "nav-projects", title: "Scroll to Projects", category: "Navigation", icon: Code, action: () => scrollToSection("projects") },
    { id: "nav-experience", title: "Scroll to Experience", category: "Navigation", icon: Award, action: () => scrollToSection("experience") },
    { id: "nav-achievements", title: "Scroll to Achievements", category: "Navigation", icon: Award, action: () => scrollToSection("achievements") },
    { id: "nav-contact", title: "Scroll to Contact", category: "Navigation", icon: Send, action: () => scrollToSection("contact") },
    { id: "util-music", title: musicPlaying ? "Stop Cyberpunk Ambient Synth" : "Start Cyberpunk Ambient Synth", category: "Ambient Sound", icon: Music, action: onToggleMusic },
    { id: "util-chat", title: "Ask AI Chatbot (HarisBot)", category: "Intelligence", icon: Sparkles, action: onOpenChat },
    { id: "util-resume", title: "View / Download Resume", category: "Assets", icon: FileText, action: () => scrollToSection("resume") },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset selection index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleArrowKeys = (e: any) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <>
      {/* Global Shortcut Help Button */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-xs text-white/50 hover:text-cyan-400 transition cursor-pointer shadow-lg"
          title="Open Command Menu"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘K</kbd>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-xl rounded-2xl bg-[#0b081e]/90 border border-white/15 shadow-2xl overflow-hidden flex flex-col"
              onKeyDown={handleArrowKeys}
              ref={containerRef}
            >
              {/* Search input bar */}
              <div className="p-4 flex items-center gap-3 border-b border-white/10 bg-white/5">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or nav section... (e.g. 'projects', 'music')"
                  className="flex-1 bg-transparent text-white placeholder-white/40 border-none outline-none text-base"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Commands List */}
              <div className="max-h-[350px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, index) => {
                    const Icon = cmd.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 text-white"
                            : "border border-transparent text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{cmd.title}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">{cmd.category}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div layoutId="arrow" className="text-cyan-400 flex items-center gap-1.5 text-xs">
                            <span>Execute</span>
                            <ArrowRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-white/40">
                    <p className="text-sm">No results found for "{query}"</p>
                    <p className="text-xs mt-1">Try searching "home", "skills", or "music".</p>
                  </div>
                )}
              </div>

              {/* Footer / Info */}
              <div className="p-3 border-t border-white/5 bg-[#03010b] flex items-center justify-between text-[11px] text-white/40">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑↓</span> Move
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Enter</span> Select
                </span>
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10">Esc</kbd> to exit</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
