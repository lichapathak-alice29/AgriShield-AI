import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Leaf, Sprout, LogOut } from "lucide-react";
import { useAgrishield } from "@/hooks/useAgrishield";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Profile — AgriShield AI" }] }),
});

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAgrishield();

  const handleLogout = () => {
    logout();
    toast.success("Successfully signed out.");
    navigate({ to: "/login" });
  };

  const displayName = user?.name || "Amina Okoro";
  const displayEmail = user?.email || "amina@verdant.co";
  const displayRole = user?.role || "Head Grower";

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
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Your farm, your crops, your team.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background hover:bg-accent/40 px-4 py-2 text-xs font-semibold transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 flex flex-wrap items-center gap-6">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald to-forest grid place-items-center text-2xl font-bold text-white shadow-glow-emerald">
          {initials}
        </div>
        <div className="flex-1 min-w-[220px]">
          <div className="text-2xl font-bold">{displayName}</div>
          <div className="text-sm text-muted-foreground">{displayRole} · Verdant Farms</div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3"/> {displayEmail}</span>
            <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3"/> +254 700 000 000</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3"/> Nairobi, Kenya</span>
          </div>
        </div>
        <button className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium">Edit profile</button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-4 w-4 text-emerald"/>
            <div className="font-semibold">Greenhouses</div>
          </div>
          <div className="space-y-3">
            {[
              { n: "Basil House", z: "3 zones · 480 m²", h: 92 },
              { n: "Tomato Bay", z: "2 zones · 320 m²", h: 87 },
              { n: "Herb Nursery", z: "1 zone · 150 m²", h: 94 },
            ].map((g) => (
              <div key={g.n} className="rounded-2xl border border-border p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium">{g.n}</div>
                  <div className="text-xs text-muted-foreground">{g.z}</div>
                </div>
                <div className="text-emerald font-semibold tabular-nums">{g.h}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="h-4 w-4 text-emerald"/>
            <div className="font-semibold">Crops</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "Basil", stage: "Flowering", yield: "82%" },
              { n: "Cherry Tomato", stage: "Fruiting", yield: "76%" },
              { n: "Mint", stage: "Vegetative", yield: "91%" },
              { n: "Lettuce", stage: "Mature", yield: "88%" },
            ].map((c) => (
              <div key={c.n} className="rounded-2xl border border-border p-4">
                <div className="font-medium">{c.n}</div>
                <div className="text-xs text-muted-foreground">{c.stage}</div>
                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald to-forest" style={{ width: c.yield }}/>
                </div>
                <div className="text-xs mt-1.5 text-emerald font-medium">{c.yield} · on track</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
