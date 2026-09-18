import clsx from "clsx";

// ---------------------------------------------------------------------------
// v5 — официальный логотип FomoUni (загружен пользователем). Два файла на
// вариант (тёмный/белый), переключение по теме — чистым CSS (см. globals.css
// .fu-logo-for-*-theme), без лишнего JS/мигания. "icon" — только шапка с
// конфедерационной доской, "full" — полный lock-up с текстом "FomoUni".
// ---------------------------------------------------------------------------

export function Logo({
  variant = "full",
  className,
  alt = "FomoUni",
}: {
  variant?: "icon" | "full";
  className?: string;
  alt?: string;
}) {
  const colored = variant === "icon" ? "/logo-icon.png" : "/logo-full.png";
  const white = variant === "icon" ? "/logo-icon-white.png" : "/logo-full-white.png";
  return (
    <>
      <img src={colored} alt={alt} className={clsx("fu-logo-for-light-theme", className)} />
      <img src={white} alt={alt} className={clsx("fu-logo-for-dark-theme", className)} />
    </>
  );
}
