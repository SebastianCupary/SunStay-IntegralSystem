import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "SunStay — Acceso",
};

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "calc(var(--spacing-unit) * 6)",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            color: "var(--color-primary)",
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "calc(var(--spacing-unit) * 0.5)",
            textAlign: "center",
          }}
        >
          SunStay
        </h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "14px",
            marginBottom: "calc(var(--spacing-unit) * 4)",
            textAlign: "center",
          }}
        >
          Hotel Tropical Sun — Acceso
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
