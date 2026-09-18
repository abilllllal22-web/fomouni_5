import type { Config } from "tailwindcss";

// Дизайн-система FomoUni:
// — брендовый цвет: приглушённый фиолетовый #B57ED1 (доверие, «путь»)
// — основа: чёрный/графит #000000 → ink-950 (уверенная типографика)
// — акцент: приглушённая терракота — только для предупреждений/дедлайнов,
//   специально десатурирована, чтобы не создавать резкий контраст с
//   фиолетовым/чёрным дуэтом.
// Ровно два основных цвета сайта — #000000 и #B57ED1 — плюс минимум
// нейтралей; никакого дополнительного яркого/контрастного акцента.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // v4: canvas/ink/line теперь читаются из CSS-переменных (см.
        // globals.css :root / [data-theme="dark"]) — это даёт переключение
        // тема без переписывания classNames по всему проекту: bg-canvas,
        // text-ink-950 и т.д. сами меняются при смене data-theme на <html>.
        ink: {
          950: "rgb(var(--color-ink-950) / <alpha-value>)",
          900: "rgb(var(--color-ink-900) / <alpha-value>)",
          800: "#1B2140",
          700: "#272F55",
          600: "#3A4270",
        },
        brand: {
          50: "#F7F2FA",
          100: "#EEE1F4",
          200: "#E0C8EC",
          300: "#CAA2DF",
          400: "#B57ED1",
          500: "#A25AC6",
          600: "#8C3FB4",
          700: "#723392",
          800: "#592772",
          900: "#421E55",
        },
        coral: {
          50: "#FAF4F2",
          100: "#F1E0DA",
          200: "#E6C7BC",
          300: "#D5A290",
          400: "#C7846B",
          500: "#B96546",
          600: "#9B553B",
          700: "#7E4430",
          800: "#643626",
        },
        canvas: {
          DEFAULT: "rgb(var(--color-canvas) / <alpha-value>)",
          card: "rgb(var(--color-canvas-card) / <alpha-value>)",
          muted: "rgb(var(--color-canvas-muted) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--color-line) / <alpha-value>)",
          strong: "rgb(var(--color-line-strong) / <alpha-value>)",
        },
        ink600text: "rgb(var(--color-ink-600text) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17, 22, 43, 0.04), 0 8px 24px -8px rgba(17, 22, 43, 0.10)",
        cardHover: "0 4px 10px rgba(17, 22, 43, 0.06), 0 16px 36px -12px rgba(17, 22, 43, 0.16)",
        pop: "0 20px 50px -12px rgba(140, 63, 180, 0.30)",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
        fadeUp: "fadeUp 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
