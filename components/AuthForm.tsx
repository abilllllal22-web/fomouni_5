"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useT } from "./LocaleProvider";

// ---------------------------------------------------------------------------
// v6 — общая форма для /login и /signup. Всё выполняется локально в браузере
// (см. store/authStore.ts) — никакого реального сервера аутентификации нет,
// это честно объясняется прямо в форме и в /privacy, а не маскируется под
// "настоящий" вход.
// ---------------------------------------------------------------------------

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const t = useT();
  const signUp = useAuthStore((s) => s.signUp);
  const logIn = useAuthStore((s) => s.logIn);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const res = await signUp(name, email, password);
        if (!res.ok) {
          setError(res.error === "exists" ? t("auth.errorExists") : t("auth.errorInvalid"));
          return;
        }
      } else {
        const res = await logIn(email, password);
        if (!res.ok) {
          setError(res.error === "not-found" ? t("auth.errorNotFound") : t("auth.errorWrongPassword"));
          return;
        }
      }
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fu-card-premium mx-auto max-w-md">
      <h1 className="mb-1 font-display text-2xl font-extrabold text-ink-950">
        {mode === "signup" ? t("auth.signupTitle") : t("auth.loginTitle")}
      </h1>
      <p className="mb-6 text-sm text-ink600text">{t("auth.localNotice")}</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === "signup" && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink600text">
              {t("auth.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fu-focus-ring w-full rounded-xl border border-line bg-canvas-card px-4 py-2.5 text-sm text-ink-900"
              placeholder={t("auth.namePlaceholder")}
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink600text">
            {t("auth.email")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="fu-focus-ring w-full rounded-xl border border-line bg-canvas-card px-4 py-2.5 text-sm text-ink-900"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink600text">
            {t("auth.password")}
          </label>
          <input
            type="password"
            required
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="fu-focus-ring w-full rounded-xl border border-line bg-canvas-card px-4 py-2.5 text-sm text-ink-900"
            placeholder="••••••••"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        {error && <p className="text-sm font-medium text-coral-700">{error}</p>}

        <button type="submit" disabled={submitting} className="fu-btn-primary w-full !py-3">
          {mode === "signup" ? t("auth.signupCta") : t("auth.loginCta")}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink600text">
        {mode === "signup" ? (
          <>
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="font-semibold text-brand-700 underline underline-offset-2">
              {t("auth.loginCta")}
            </Link>
          </>
        ) : (
          <>
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="font-semibold text-brand-700 underline underline-offset-2">
              {t("auth.signupCta")}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
