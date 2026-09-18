import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import { CookieNotice } from "@/components/CookieNotice";

// Шрифты — системный стек (без next/font/google): ноль сетевых запросов при
// сборке и в рантайме, стабильная сборка в любой CI/офлайн-среде за 72 часа
// хакатона. Визуальная иерархия держится на весе/кегле/трекинге, а не на
// экзотическом веб-шрифте — см. --font-display/--font-body в globals.css.

export const metadata: Metadata = {
  title: "FomoUni — персональный маршрут поступления",
  description:
    "FomoUni превращает профиль и цель абитуриента в понятный маршрут: куда поступать, почему этот вариант подходит и что делать следующим шагом.",
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // v6: maximumScale не задаём — запрет pinch-to-zoom мешает пользоваться
  // сайтом с телефона (плохо для доступности), а мобильное удобство было
  // отдельным явным требованием.
  themeColor: "#080B16",
};

// v4: тёмно-синяя тема — фирменный вид продукта по умолчанию для новых
// посетителей. Инлайн-скрипт выполняется синхронно ДО первой отрисовки и
// выставляет data-theme на <html>, поэтому нет вспышки светлой темы
// (flash of unstyled/wrong theme) при заходе на сайт или ре-визите.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("fomouni-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <LocaleProvider>
          {children}
          <CookieNotice />
        </LocaleProvider>
      </body>
    </html>
  );
}
