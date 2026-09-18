"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// v6 — локальная (демо) система аккаунтов: регистрация и вход полностью на
// стороне браузера, без сервера и без сети — кейс прямо разрешает "заменить
// сложный backend локальным хранением, если полный путь работает". Пароль
// не хранится в открытом виде: на устройстве считается SHA-256 (Web Crypto
// API), а не сам пароль. Это НЕ промышленная защита — честно описано так в
// /privacy, и заведено сознательно как учебный/демо-уровень, а не выдаётся
// за настоящую серверную аутентификацию.
// ---------------------------------------------------------------------------

export interface StoredAccount {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string; // ISO
}

interface AuthState {
  accounts: Record<string, StoredAccount>; // ключ — email.toLowerCase()
  currentEmail: string | null;
  hasHydrated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: "invalid" | "exists" }>;
  logIn: (email: string, password: string) => Promise<{ ok: boolean; error?: "not-found" | "wrong-password" }>;
  logOut: () => void;
  deleteAccount: (email: string) => void;
  setHasHydrated: (v: boolean) => void;
}

async function hashPassword(password: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    try {
      const enc = new TextEncoder().encode(password);
      const buf = await window.crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      // падаем в фолбэк ниже
    }
  }
  // Фолбэк на случай недоступности Web Crypto (нетипично для браузера) —
  // тоже не хранит пароль как есть.
  let h = 0;
  for (let i = 0; i < password.length; i++) h = (Math.imul(31, h) + password.charCodeAt(i)) | 0;
  return `fb-${h}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: {},
      currentEmail: null,
      hasHydrated: false,

      signUp: async (name, email, password) => {
        const key = email.trim().toLowerCase();
        if (!key || !key.includes("@") || password.length < 4) {
          return { ok: false, error: "invalid" };
        }
        if (get().accounts[key]) {
          return { ok: false, error: "exists" };
        }
        const passwordHash = await hashPassword(password);
        const account: StoredAccount = {
          name: name.trim() || key.split("@")[0],
          email: key,
          passwordHash,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          accounts: { ...state.accounts, [key]: account },
          currentEmail: key,
        }));
        return { ok: true };
      },

      logIn: async (email, password) => {
        const key = email.trim().toLowerCase();
        const account = get().accounts[key];
        if (!account) return { ok: false, error: "not-found" };
        const passwordHash = await hashPassword(password);
        if (passwordHash !== account.passwordHash) return { ok: false, error: "wrong-password" };
        set({ currentEmail: key });
        return { ok: true };
      },

      logOut: () => set({ currentEmail: null }),

      deleteAccount: (email) =>
        set((state) => {
          const key = email.trim().toLowerCase();
          const next = { ...state.accounts };
          delete next[key];
          return {
            accounts: next,
            currentEmail: state.currentEmail === key ? null : state.currentEmail,
          };
        }),

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "fomouni-auth-store",
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function useCurrentAccount(): StoredAccount | null {
  const currentEmail = useAuthStore((s) => s.currentEmail);
  const accounts = useAuthStore((s) => s.accounts);
  if (!currentEmail) return null;
  return accounts[currentEmail] ?? null;
}
