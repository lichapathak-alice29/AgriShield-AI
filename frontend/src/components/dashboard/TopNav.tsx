import { Bell, Search, Sun, Moon, Cloud, MapPin } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAgrishield } from "@/hooks/useAgrishield";

export function TopNav() {
  const { theme, toggle } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAgrishield();
  const displayName = user?.name || "User";
  const getInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const initials = getInitials(displayName);
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> Guwahati, Assam, India</div>
          <div className="font-semibold text-sm truncate">Greenhouse 04 — "Basil House"</div>
        </div>

        <div className="hidden md:flex ml-6 items-center gap-2 rounded-full bg-muted/70 px-3 h-9 w-72">
          <Search className="h-4 w-4 text-muted-foreground"/>
          <input placeholder="Search sensors, devices, zones…" className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground" />
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">⌘K</kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-xs">
            <Cloud className="h-4 w-4 text-sky-accent"/>
            <span className="font-medium">26°C</span>
            <span className="text-muted-foreground">· Partly cloudy</span>
          </div>

          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition"
          >
            <Bell className="h-4 w-4"/>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-critical animate-pulse-glow"/>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute top-14 right-4 w-80 rounded-2xl border border-border bg-popover shadow-elegant p-2"
              >
                <div className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">Recent</div>
                {["Soil moisture low — Zone B", "Fan auto-engaged — Zone A", "Irrigation completed"].map((t, i) => (
                  <div key={i} className="px-3 py-2 rounded-xl hover:bg-accent text-sm">{t}</div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={toggle} className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </button>

          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald to-forest grid place-items-center text-white text-xs font-semibold shadow-glow-emerald">{initials}</div>
        </div>
      </div>
    </header>
  );
}
