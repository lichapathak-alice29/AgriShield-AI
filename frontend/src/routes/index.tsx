import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Leaf, ShieldCheck, Droplets, Activity, ArrowRight, Sparkles,
  BarChart3, Cpu, Zap, ChevronDown, Radio, Bell, Gauge, SlidersHorizontal,
  Cloud, Brain, LayoutDashboard, Github, Linkedin, Instagram, Mail, Thermometer,
  Wind, Sun,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "AgriShield AI — Intelligent Greenhouse Automation" },
      { name: "description", content: "Monitor environmental conditions, automate irrigation, remotely control greenhouse devices, receive instant alerts, and optimize crop health using IoT and AI-powered automation." },
      { property: "og:title", content: "AgriShield AI — Intelligent Greenhouse Automation" },
      { property: "og:description", content: "Monitor environmental conditions, automate irrigation, remotely control greenhouse devices, receive instant alerts, and optimize crop health using IoT and AI-powered automation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <AmbientBackground />
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Stats />
      <TechStack />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------------- Ambient background ---------------- */
function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-emerald/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-forest/25 blur-[130px] animate-float-slow" />
      <div className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-sky-accent/10 blur-[120px] animate-pulse-glow" />
      {/* particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-emerald/40"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald to-forest grid place-items-center shadow-glow-emerald">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">AgriShield<span className="text-emerald"> AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#preview" className="hover:text-foreground transition">Dashboard</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-2">Sign in</Link>
          <Link to="/app" className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition">
            Open Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative pt-36 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/5 backdrop-blur px-3 py-1 text-xs font-medium text-emerald"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered greenhouse intelligence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.02]"
          >
            Intelligent Greenhouse{" "}
            <span className="text-gradient-emerald">Automation</span>{" "}
            for Modern Agriculture
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Monitor environmental conditions, automate irrigation, remotely control greenhouse devices, receive instant alerts, and optimize crop health using IoT and AI-powered automation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              to="/app"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-forest text-white px-6 py-3.5 text-sm font-medium shadow-glow-emerald hover:shadow-[0_25px_70px_-15px_var(--emerald)] transition-all"
            >
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition" />
              Open Dashboard
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#preview"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-6 py-3.5 text-sm font-medium hover:border-emerald/50 hover:text-emerald transition-all"
            >
              Live Demo
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald"/> SOC 2 ready</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald"/> 99.9% uptime</div>
            <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-emerald"/> Real-time telemetry</div>
          </motion.div>
        </div>

        <HeroGreenhouse />
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-6 text-muted-foreground"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </motion.div>
    </section>
  );
}

function HeroGreenhouse() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
      className="relative aspect-square max-w-[560px] mx-auto w-full"
    >
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-emerald/25 via-transparent to-sky-accent/15 blur-3xl animate-pulse-glow" />
      <div className="relative h-full w-full glass-card rounded-[2.5rem] p-6 overflow-hidden">
        {/* grid */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(var(--emerald) 1px, transparent 1px), linear-gradient(90deg, var(--emerald) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }} />

        <svg viewBox="0 0 400 400" className="relative h-full w-full">
          <defs>
            <linearGradient id="roof2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.16 155)" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="oklch(0.35 0.09 155)" stopOpacity="0.95"/>
            </linearGradient>
            <linearGradient id="glass2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="white" stopOpacity="0.05"/>
            </linearGradient>
            <radialGradient id="sun2">
              <stop offset="0%" stopColor="oklch(0.9 0.14 75)" stopOpacity="1"/>
              <stop offset="100%" stopColor="oklch(0.85 0.14 75)" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Sun */}
          <motion.circle cx="330" cy="70" r="50" fill="url(#sun2)"
            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }} />
          <circle cx="330" cy="70" r="20" fill="oklch(0.9 0.14 75)"/>

          {/* Greenhouse */}
          <polygon points="70,180 200,80 330,180" fill="url(#roof2)"/>
          <rect x="70" y="180" width="260" height="170" fill="url(#glass2)" stroke="oklch(0.55 0.15 155)" strokeWidth="2" rx="4"/>
          <line x1="200" y1="80" x2="200" y2="350" stroke="oklch(0.35 0.09 155)" strokeWidth="1.5" opacity="0.5"/>
          <line x1="135" y1="130" x2="135" y2="350" stroke="oklch(0.35 0.09 155)" strokeWidth="1" opacity="0.35"/>
          <line x1="265" y1="130" x2="265" y2="350" stroke="oklch(0.35 0.09 155)" strokeWidth="1" opacity="0.35"/>
          <line x1="70" y1="245" x2="330" y2="245" stroke="oklch(0.35 0.09 155)" strokeWidth="1" opacity="0.35"/>

          {/* Irrigation pipe */}
          <line x1="70" y1="205" x2="330" y2="205" stroke="oklch(0.72 0.11 220)" strokeWidth="3" opacity="0.6"/>
          {[110, 160, 210, 260, 300].map((x, i) => (
            <motion.circle key={i} cx={x} cy="215" r="3" fill="oklch(0.72 0.11 220)"
              animate={{ cy: [215, 305], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, delay: i * 0.35, repeat: Infinity }} />
          ))}

          {/* Plants */}
          {[110, 160, 210, 260, 300].map((x, i) => (
            <motion.g key={i} initial={{ scaleY: 0.9 }} animate={{ scaleY: [0.92, 1.05, 0.92] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity }} style={{ transformOrigin: `${x}px 325px` }}>
              <rect x={x - 12} y="310" width="24" height="10" rx="2" fill="oklch(0.35 0.05 40)"/>
              <ellipse cx={x} cy="295" rx="14" ry="18" fill="oklch(0.55 0.15 155)"/>
              <ellipse cx={x - 6} cy="285" rx="8" ry="10" fill="oklch(0.62 0.16 155)"/>
              <ellipse cx={x + 6} cy="285" rx="8" ry="10" fill="oklch(0.62 0.16 155)"/>
            </motion.g>
          ))}

          {/* Fan */}
          <g transform="translate(310, 215)">
            <circle r="16" fill="oklch(0.18 0.02 160)" opacity="0.9"/>
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}>
              <ellipse rx="11" ry="3" fill="oklch(0.9 0.02 155)"/>
              <ellipse rx="3" ry="11" fill="oklch(0.9 0.02 155)"/>
            </motion.g>
            <circle r="2.5" fill="oklch(0.62 0.16 155)"/>
          </g>

          {/* IoT nodes */}
          {[{x:90,y:230},{x:200,y:265},{x:280,y:280}].map((p, i) => (
            <g key={i}>
              <motion.circle cx={p.x} cy={p.y} r="14" fill="oklch(0.62 0.16 155)" opacity="0.15"
                animate={{ r: [14, 22, 14], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity }} />
              <circle cx={p.x} cy={p.y} r="5" fill="oklch(0.62 0.16 155)"/>
              <circle cx={p.x} cy={p.y} r="2" fill="white"/>
            </g>
          ))}
        </svg>

        {/* Floating tag: Temp */}
        <FloatingTag className="top-6 left-6" delay={0.5} icon={<Thermometer className="h-3.5 w-3.5 text-critical"/>} label="Temp" value="24.6°C"/>
        {/* Humidity */}
        <FloatingTag className="top-6 right-6" delay={0.65} icon={<Droplets className="h-3.5 w-3.5 text-sky-accent"/>} label="Humidity" value="68%"/>
        {/* Soil */}
        <FloatingTag className="bottom-24 left-6" delay={0.8} icon={<Leaf className="h-3.5 w-3.5 text-emerald"/>} label="Soil" value="42%"/>
        {/* Water tank */}
        <FloatingTag className="bottom-24 right-6" delay={0.95} icon={<Gauge className="h-3.5 w-3.5 text-amber-accent"/>} label="Tank" value="76%"/>

        {/* Health gauge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-background/85 backdrop-blur border border-border/60 px-4 py-2 text-xs shadow-elegant flex items-center gap-3"
        >
          <div className="relative h-9 w-9">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15" stroke="oklch(0.92 0.008 155)" strokeWidth="3" fill="none"/>
              <motion.circle
                cx="18" cy="18" r="15" stroke="oklch(0.62 0.16 155)" strokeWidth="3" fill="none"
                strokeLinecap="round" strokeDasharray="94"
                initial={{ strokeDashoffset: 94 }} animate={{ strokeDashoffset: 8 }}
                transition={{ duration: 1.4, delay: 1.2 }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[10px] font-bold">92</div>
          </div>
          <div>
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">AI Health</div>
            <div className="font-semibold text-emerald">Optimal</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FloatingTag({ className, icon, label, value, delay = 0 }:
  { className?: string; icon: React.ReactNode; label: string; value: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`absolute rounded-2xl bg-background/85 backdrop-blur border border-border/60 px-3 py-2 text-xs shadow-elegant flex items-center gap-2 animate-float-slow ${className}`}
    >
      {icon}
      <div>
        <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </motion.div>
  );
}

/* ---------------- Features ---------------- */
function Features() {
  const feats = [
    { icon: Radio, title: "Real-Time Monitoring", body: "Sub-second telemetry from every ESP32 sensor node in your greenhouse." },
    { icon: Brain, title: "AI Health Score", body: "A single index tuned to your crop, climate history and growth stage." },
    { icon: Droplets, title: "Smart Irrigation", body: "Automated dosing schedules that save up to 38% water per cycle." },
    { icon: SlidersHorizontal, title: "Remote Device Control", body: "Toggle pumps, fans, lights and shades from anywhere in one tap." },
    { icon: Bell, title: "Instant Alerts", body: "Anomaly detection escalated instantly across SMS, email and push." },
    { icon: BarChart3, title: "Historical Analytics", body: "Compare seasons and zones with production-grade reporting." },
  ];
  return (
    <section id="features" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHead eyebrow="Platform" title="Everything a greenhouse needs. Unified." subtitle="A single operating system for controlled-environment agriculture." />
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feats.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl glass-card p-7 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-emerald/25 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/25 grid place-items-center shadow-glow-emerald">
                  <f.icon className="h-5 w-5 text-emerald" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const steps = [
    { icon: Cpu, title: "ESP32 Sensors", body: "Rugged IoT nodes stream soil, air and light data every second." },
    { icon: Cloud, title: "Cloud Processing", body: "Encrypted ingestion pipeline normalizes millions of events daily." },
    { icon: Brain, title: "AI Analysis", body: "Predictive models detect stress, disease and yield opportunities." },
    { icon: LayoutDashboard, title: "Dashboard & Automation", body: "Live twin, alerts and one-tap device control from anywhere." },
  ];
  return (
    <section id="how" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHead eyebrow="Pipeline" title="From soil to signal to action." subtitle="A frictionless four-step system that turns raw sensor data into precise control." />
        <div className="mt-16 relative">
          <div className="hidden lg:block absolute top-16 left-[6%] right-[6%] h-px bg-gradient-to-r from-transparent via-emerald/50 to-transparent" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="relative h-32 rounded-3xl glass-card grid place-items-center mb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/10 via-transparent to-transparent" />
                  <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald to-forest grid place-items-center shadow-glow-emerald">
                    <s.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute top-3 right-4 text-xs font-mono text-muted-foreground">0{i + 1}</div>
                </div>
                <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Dashboard preview ---------------- */
function DashboardPreview() {
  return (
    <section id="preview" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHead eyebrow="Command Center" title="Your greenhouse, visualized." subtitle="A living digital twin that reacts to every change in temperature, moisture and light." />

        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative rounded-[2rem] border border-border bg-card shadow-elegant overflow-hidden"
        >
          <div className="flex items-center gap-1.5 px-5 py-3 border-b border-border/60 bg-muted/40">
            <span className="h-2.5 w-2.5 rounded-full bg-critical/70"/>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-accent/70"/>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald/70"/>
            <span className="ml-3 text-xs text-muted-foreground">app.agrishield.ai / dashboard</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald"><span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse"/> Live</span>
          </div>

          <div className="p-6 grid md:grid-cols-4 gap-4">
            {[
              { label: "Temperature", value: "24.6", unit: "°C", icon: Thermometer },
              { label: "Humidity", value: "68", unit: "%", icon: Droplets },
              { label: "Soil Moisture", value: "42", unit: "%", icon: Leaf },
              { label: "Water Level", value: "76", unit: "%", icon: Gauge },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-border p-4 bg-background/60">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <k.icon className="h-3.5 w-3.5 text-emerald" />
                </div>
                <div className="mt-2 text-2xl font-semibold">{k.value}<span className="text-sm text-muted-foreground ml-1">{k.unit}</span></div>
                <div className="mt-3 h-8 rounded-lg bg-gradient-to-r from-emerald/25 to-emerald/5 relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer" style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.25), transparent)", backgroundSize: "200% 100%" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 pb-6 grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl border border-border bg-background/60 p-6 h-64 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Environmental stability · 24h</div>
                <div className="text-xs text-emerald">+2.4% vs yesterday</div>
              </div>
              <svg viewBox="0 0 400 140" className="absolute bottom-4 left-4 right-4 w-[calc(100%-2rem)]">
                <defs>
                  <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.16 155)" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="oklch(0.62 0.16 155)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,90 Q50,50 100,70 T200,55 T300,45 T400,60 L400,140 L0,140 Z" fill="url(#area1)"/>
                <path d="M0,90 Q50,50 100,70 T200,55 T300,45 T400,60" stroke="oklch(0.62 0.16 155)" strokeWidth="2.5" fill="none"/>
                <path d="M0,110 Q60,90 120,95 T240,85 T360,90 T400,88" stroke="oklch(0.72 0.11 220)" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.7"/>
              </svg>
            </div>

            <div className="rounded-2xl border border-border bg-background/60 p-6 h-64 flex flex-col items-center justify-center">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" stroke="oklch(0.92 0.008 155)" strokeWidth="8" fill="none"/>
                  <motion.circle
                    cx="50" cy="50" r="42" stroke="oklch(0.62 0.16 155)" strokeWidth="8" fill="none"
                    strokeDasharray="264" strokeLinecap="round"
                    initial={{ strokeDashoffset: 264 }} whileInView={{ strokeDashoffset: 26 }} viewport={{ once: true }}
                    transition={{ duration: 1.6 }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center"><div className="text-3xl font-bold">92</div><div className="text-[10px] text-muted-foreground uppercase tracking-wider">Health</div></div>
                </div>
              </div>
              <div className="text-xs text-emerald mt-2 font-medium">Greenhouse stable</div>
            </div>
          </div>

          <div className="px-6 pb-6 grid md:grid-cols-3 gap-4">
            {[
              { name: "Water Pump", state: "Active", icon: Droplets, on: true },
              { name: "Ventilation Fan", state: "Idle", icon: Wind, on: false },
              { name: "Grow Lights", state: "Active", icon: Sun, on: true },
            ].map((d) => (
              <div key={d.name} className="rounded-2xl border border-border bg-background/60 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center ${d.on ? "bg-emerald/15 text-emerald" : "bg-muted text-muted-foreground"}`}>
                    <d.icon className="h-4 w-4"/>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.state}</div>
                  </div>
                </div>
                <div className={`h-6 w-11 rounded-full p-0.5 transition ${d.on ? "bg-emerald" : "bg-muted"}`}>
                  <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${d.on ? "translate-x-5" : ""}`}/>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-border bg-background/60 p-5">
              <div className="text-sm font-medium mb-3">Recent alerts</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-critical"/>Soil moisture below threshold — Zone B<span className="ml-auto text-xs text-muted-foreground">2 min</span></li>
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-amber-accent"/>Temperature rising above 32°C<span className="ml-auto text-xs text-muted-foreground">18 min</span></li>
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald"/>Irrigation cycle completed<span className="ml-auto text-xs text-muted-foreground">1 hr</span></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
function useCounter(target: number, duration = 1.6) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, target, duration]);
  return { ref, val };
}

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const { ref, val } = useCounter(to);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

function Stats() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { render: <><Counter to={99.9} decimals={1} suffix="%" /></>, l: "System Uptime" },
          { render: <>24/7</>, l: "Monitoring" },
          { render: <><Counter to={5} />+</>, l: "IoT Sensors" },
          { render: <>&lt;<Counter to={2} />s</>, l: "Response Time" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <div className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient-emerald">{s.render}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Tech stack ---------------- */
function TechStack() {
  const techs = ["ESP32", "React", "Node.js", "MongoDB", "Firebase", "Socket.io", "Tailwind CSS", "Chart.js"];
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-10">Built on a modern, reliable stack</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {techs.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl glass-card px-4 py-3 text-center text-sm font-medium tracking-tight hover:border-emerald/40 hover:text-emerald transition-all"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const items = [
    { name: "Aditi Rao", role: "Farm Manager · Verdant Farms", quote: "AgriShield turned three greenhouses into one calm control room. Water use is down 32% and my team sleeps better.", initials: "AR" },
    { name: "Marcus Chen", role: "Head of Ops · Northfield Co.", quote: "The AI health score catches disease pressure two days before we would have. It has paid for itself in a single season.", initials: "MC" },
    { name: "Elena Duarte", role: "Agronomist · Terra Nova", quote: "Beautiful interface, brutal reliability. The digital twin is now how we onboard every new grower on the team.", initials: "ED" },
  ];
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHead eyebrow="Loved by growers" title="Trusted where every degree matters." subtitle="Teams running high-value crops rely on AgriShield to protect yield and quality." />
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl glass-card p-7 hover:-translate-y-1 transition-all"
            >
              <div className="text-emerald text-3xl leading-none">&ldquo;</div>
              <blockquote className="mt-2 text-sm leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald to-forest grid place-items-center text-white text-xs font-semibold">{t.initials}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const qs = [
    { q: "What hardware does AgriShield support?", a: "Any ESP32-class board with our open sensor firmware. We also support most industry MQTT-compatible controllers out of the box." },
    { q: "Can I control devices remotely from my phone?", a: "Yes. Toggle pumps, fans, lights and shades from the dashboard on any device. Actions replicate to the controller in under two seconds." },
    { q: "How does the AI health score work?", a: "A model tuned to your crop combines environmental telemetry, historical yield, and disease pressure to produce a single 0-100 index updated live." },
    { q: "Is my data secure?", a: "All traffic is encrypted end-to-end. Data is isolated per tenant and we are SOC 2 ready with granular role-based access." },
    { q: "Do you offer a free trial?", a: "Yes — you can explore the entire platform with realistic sample data, no credit card required." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHead eyebrow="FAQ" title="Answers, up front." subtitle="Everything you need before deploying AgriShield in your operation." />
        <div className="mt-12 space-y-3">
          {qs.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-emerald" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-5xl mx-auto rounded-[2.5rem] p-14 bg-gradient-to-br from-forest via-emerald to-forest text-white relative overflow-hidden shadow-glow-emerald"
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 90px 90px",
        }} />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-xl">Ready to Transform Your Greenhouse?</h2>
          <p className="mt-4 text-white/85 max-w-xl">Deploy AgriShield across your operation in under a day. No hardware lock-in.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app" className="inline-flex items-center gap-2 rounded-full bg-white text-forest px-6 py-3.5 text-sm font-semibold hover:opacity-95 transition">
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="mailto:hello@agrishield.ai" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-medium hover:bg-white/10 transition">
              Contact Us
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-border/60 py-14 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald to-forest grid place-items-center">
              <Leaf className="h-4 w-4 text-white"/>
            </div>
            <span className="font-semibold">AgriShield AI</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">Precision agriculture platform for the next generation of growers.</p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="GitHub" className="h-9 w-9 rounded-full border border-border grid place-items-center hover:border-emerald/50 hover:text-emerald transition"><Github className="h-4 w-4"/></a>
            <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-full border border-border grid place-items-center hover:border-emerald/50 hover:text-emerald transition"><Linkedin className="h-4 w-4"/></a>
            <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-full border border-border grid place-items-center hover:border-emerald/50 hover:text-emerald transition"><Instagram className="h-4 w-4"/></a>
            <a href="mailto:hello@agrishield.ai" aria-label="Email" className="h-9 w-9 rounded-full border border-border grid place-items-center hover:border-emerald/50 hover:text-emerald transition"><Mail className="h-4 w-4"/></a>
          </div>
        </div>
        {[
          { h: "Quick Links", l: ["Features","How it works","Dashboard","FAQ"] },
          { h: "Resources", l: ["Documentation","GitHub","Status","Security"] },
          { h: "Company", l: ["Contact","Privacy Policy","Terms","Careers"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-sm font-semibold mb-3">{c.h}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.l.map(x => <li key={x}><a href="#" className="hover:text-emerald transition">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border/60 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
        <span>© 2026 AgriShield AI. All rights reserved.</span>
        <span>Made for growers, everywhere.</span>
      </div>
    </footer>
  );
}

/* ---------------- Shared ---------------- */
function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-xs uppercase tracking-widest text-emerald font-medium">{eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-[-0.02em]">{title}</h2>
      <p className="mt-4 text-muted-foreground text-lg">{subtitle}</p>
    </div>
  );
}
