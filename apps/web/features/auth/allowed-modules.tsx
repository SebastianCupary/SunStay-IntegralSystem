"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

export function AllowedModules() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    api
      .get<AuthUser>("/auth/me")
      .then((data) => {
        if (isMounted) {
          setUser(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("No se pudo cargar la sesión autenticada.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <p style={{ color: "var(--color-destructive)" }}>{error}</p>;
  }

  if (!user) {
    return <p style={{ color: "var(--color-text-secondary)" }}>Cargando permisos...</p>;
  }

  const visibleModules = user.permissions.filter((permission) => permission.canView);

  return (
    <div style={{ marginTop: "calc(var(--spacing-unit) * 3)" }}>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 8 }}>
        Sesión: {user.fullName} · {user.role.name}
      </p>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Módulos habilitados</h2>
      <ul style={{ display: "grid", gap: 8, listStyle: "none" }}>
        {visibleModules.map((permission) => (
          <li
            key={permission.module.code}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "calc(var(--spacing-unit) * 1.25)",
            }}
          >
            {permission.module.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
