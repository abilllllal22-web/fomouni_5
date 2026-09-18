"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BgPattern } from "@/components/BgPattern";
import { useAuthStore, useCurrentAccount } from "@/store/authStore";
import { useT } from "@/components/LocaleProvider";

export default function AccountPage() {
  const router = useRouter();
  const t = useT();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const account = useCurrentAccount();
  const logOut = useAuthStore((s) => s.logOut);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  useEffect(() => {
    if (hasHydrated && !account) router.replace("/login");
  }, [hasHydrated, account, router]);

  if (!account) return null;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas">
      <BgPattern />
      <SiteHeader active="login" />
      <div className="relative mx-auto max-w-2xl px-5 pb-20 pt-10 sm:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("auth.accountTitle")}</p>
        <h1 className="mb-6 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {account.name}
        </h1>

        <div className="fu-card mb-5 space-y-2">
          <p className="text-sm text-ink600text">
            <span className="font-semibold text-ink-900">{t("auth.email")}:</span> {account.email}
          </p>
          <p className="text-sm text-ink600text">{t("auth.localNotice")}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              logOut();
              router.push("/");
            }}
            className="fu-btn-secondary"
          >
            {t("auth.logout")}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t("auth.confirmDelete"))) {
                deleteAccount(account.email);
                router.push("/");
              }
            }}
            className="fu-btn-ghost text-coral-700"
          >
            {t("auth.deleteAccount")}
          </button>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
