import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — AgriShield AI" }] }),
});

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/app" });
  }, [navigate]);

  return null;
}
