import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAgrishield } from "@/hooks/useAgrishield";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — AgriShield AI" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAgrishield();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to AgriShield AI!");
      navigate({ to: "/app" });
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in to your command center."
      footer={<>New here? <Link to="/register" className="text-emerald hover:underline">Create an account</Link></>}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input 
              id="email" 
              type="email" 
              required 
              placeholder="you@farm.co" 
              className="pl-10 h-11 rounded-xl bg-background" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-emerald hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input 
              id="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="pl-10 h-11 rounded-xl bg-background" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <Button disabled={loading} type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald to-forest text-white shadow-glow-emerald hover:opacity-95">
          {loading ? "Signing in…" : <>Sign in <ArrowRight className="ml-1 h-4 w-4"/></>}
        </Button>
        <div className="text-xs text-center text-muted-foreground">
          By continuing you agree to our terms.
        </div>
      </form>
    </AuthShell>
  );
}
