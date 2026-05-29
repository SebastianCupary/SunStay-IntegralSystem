"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LoginResponse, setAuthSession } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@sunstay.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      setAuthSession(response.accessToken);
      router.push("/dashboard");
    } catch {
      setError("Credenciales inválidas o usuario sin acceso activo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "calc(var(--spacing-unit) * 2)" }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            marginBottom: "calc(var(--spacing-unit) * 0.5)",
          }}
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@sunstay.local"
          autoComplete="email"
          required
          style={{
            width: "100%",
            padding: "calc(var(--spacing-unit) * 1.25)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>
      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <label
          htmlFor="password"
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            marginBottom: "calc(var(--spacing-unit) * 0.5)",
          }}
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          style={{
            width: "100%",
            padding: "calc(var(--spacing-unit) * 1.25)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>
      {error ? (
        <p
          role="alert"
          style={{
            color: "var(--color-destructive)",
            fontSize: "12px",
            marginBottom: "calc(var(--spacing-unit) * 2)",
          }}
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: "100%",
          padding: "calc(var(--spacing-unit) * 1.5)",
          backgroundColor: "var(--color-primary)",
          color: "#ffffff",
          borderRadius: "var(--radius-md)",
          border: "none",
          fontSize: "14px",
          fontWeight: 500,
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
