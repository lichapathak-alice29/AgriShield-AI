import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
  head: () => ({ meta: [{ title: "Reset password — AgriShield AI" }] }),
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell
      title="Reset password"
      subtitle="We'll email you a secure reset link."
      footer={<>Remembered it? <Link to="/login" className="text-emerald hover:underline">Sign in</Link></>}
    >
      {sent ? (
        <div className="rounded-2xl border border-emerald/30 bg-emerald/5 p-5 text-sm flex gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald shrink-0"/>
          <div>Check your inbox for a reset link. It expires in 30 minutes.</div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input id="email" type="email" required placeholder="you@farm.co" className="pl-10 h-11 rounded-xl"/>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald to-forest text-white shadow-glow-emerald hover:opacity-95">
            Send reset link <ArrowRight className="ml-1 h-4 w-4"/>
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
