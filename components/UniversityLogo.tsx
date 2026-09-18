import clsx from "clsx";
import { UniversityIcon } from "./UniversityIcon";
import { UNIVERSITY_LOGOS } from "@/lib/universityLogos";

// ---------------------------------------------------------------------------
// v7 — рендерит реальный официальный логотип вуза (когда он есть в
// UNIVERSITY_LOGOS), иначе аккуратно откатывается на прежнюю нейтральную
// иконку-монограмму (UniversityIcon). Единая точка правды для всех 5 мест,
// где раньше был <div className="fu-monogram"><UniversityIcon /></div> —
// теперь просто <UniversityLogo university={...} />.
//
// Контейнер для реального лого — белая карточка с object-contain (а не
// цветной градиентный квадрат с обрезкой), т.к. лого вузов сильно отличаются
// по пропорциям/фону и её нельзя просто "залить" в монограмму без искажений.
// ---------------------------------------------------------------------------

export function UniversityLogo({
  university,
  className,
  iconClassName,
}: {
  university: string;
  className?: string;
  iconClassName?: string;
}) {
  const logo = UNIVERSITY_LOGOS[university];

  if (logo) {
    return (
      <div className={clsx("fu-monogram-logo", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={university} className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div className={clsx("fu-monogram", className)}>
      <UniversityIcon className={iconClassName} />
    </div>
  );
}
