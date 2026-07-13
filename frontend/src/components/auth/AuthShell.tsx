import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen relative grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 mesh-bg" />
      <motion.div
        aria-hidden animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald/25 blur-3xl -z-10"
      />
      <motion.div
        aria-hidden animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-accent/20 blur-3xl -z-10"
      />

      <div className="relative flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald to-forest grid place-items-center shadow-glow-emerald">
              <Leaf className="h-4 w-4 text-white"/>
            </div>
            <span className="font-semibold tracking-tight">AgriShield<span className="text-emerald"> AI</span></span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-center text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>

      <div className="hidden lg:flex relative items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="relative max-w-md text-center"
        >
          <div className="relative aspect-square w-full">
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald/40 to-sky-accent/20 blur-2xl animate-pulse-glow" />
            <svg viewBox="0 0 400 400" className="relative h-full w-full">
              <motion.circle cx="200" cy="200" r="140" stroke="oklch(0.62 0.16 155 / 0.3)" strokeWidth="1" fill="none"
                animate={{ r: [140, 160, 140] }} transition={{ duration: 6, repeat: Infinity }} />
              <motion.circle cx="200" cy="200" r="100" stroke="oklch(0.62 0.16 155 / 0.4)" strokeWidth="1" fill="none"
                animate={{ r: [100, 120, 100] }} transition={{ duration: 5, repeat: Infinity }} />
              <circle cx="200" cy="200" r="60" fill="oklch(0.62 0.16 155 / 0.15)"/>
              <g transform="translate(200,200)">
                <path d="M 0,-30 C 25,-30 40,-10 30,20 C 20,10 -10,10 -20,20 C -30,-10 -25,-30 0,-30 Z" fill="oklch(0.62 0.16 155)" />
              </g>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Grow with intelligence.</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
            AgriShield turns your greenhouse into a self-optimizing ecosystem — no PhD required.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
