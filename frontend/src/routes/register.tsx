import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Create account — AgriShield AI" }] }),
});

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/app" });
  }, [navigate]);

  return null;
}
