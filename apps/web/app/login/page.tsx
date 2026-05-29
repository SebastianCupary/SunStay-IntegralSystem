import type { Metadata } from "next";

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
        <form>
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
              placeholder="admin@sunstay.local"
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
              placeholder="••••••••"
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
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "calc(var(--spacing-unit) * 1.5)",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              borderRadius: "var(--radius-md)",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </main>
  );
}
