import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAgrishield } from "@/hooks/useAgrishield";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Create account — AgriShield AI" }] }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAgrishield();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Farmer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success("Welcome! Your AgriShield account has been created.");
      navigate({ to: "/app" });
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Start growing smarter."
      subtitle="Create your AgriShield account in seconds."
      footer={<>Already have an account? <Link to="/login" className="text-emerald hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input 
              id="name" 
              required 
              placeholder="Amina Okoro" 
              className="pl-10 h-11 rounded-xl bg-background"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input 
              id="password" 
              type="password" 
              required 
              placeholder="At least 8 characters" 
              className="pl-10 h-11 rounded-xl bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Account Role</Label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10"/>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="pl-10 h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              <option value="Farmer">Farmer (Telemetry & Operations)</option>
              <option value="Admin">Admin (Full System Controls)</option>
            </select>
          </div>
        </div>
        <Button disabled={loading} type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald to-forest text-white shadow-glow-emerald hover:opacity-95">
          {loading ? "Creating…" : <>Create account <ArrowRight className="ml-1 h-4 w-4"/></>}
        </Button>
      </form>
    </AuthShell>
  );
}
