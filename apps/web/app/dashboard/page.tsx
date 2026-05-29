import { AllowedModules } from "@/features/auth/allowed-modules";

export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "calc(var(--spacing-unit) * 4)",
        backgroundColor: "var(--color-background)",
      }}
    >
      <section
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "calc(var(--spacing-unit) * 4)",
        }}
      >
        <p style={{ color: "var(--color-text-secondary)", marginBottom: 8 }}>
          SunStay
        </p>
        <h1 style={{ color: "var(--color-primary)", fontSize: 28 }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--color-text-secondary)", marginTop: 8 }}>
          Acceso autenticado. Los módulos operativos se integrarán en las
          siguientes fases.
        </p>
        <AllowedModules />
      </section>
    </main>
  );
}
