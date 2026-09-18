// ---------------------------------------------------------------------------
// v7 — реальные официальные логотипы вузов (присланы пользователем напрямую,
// т.к. в этой среде нет доступа к произвольным внешним доменам для их
// скачивания). Ключ — ТОЧНАЯ строка из data/universities.json → university,
// чтобы не было риска перепутать лого с чужим названием. Для вузов, для
// которых лого ещё не прислали, компонент UniversityLogo сам откатывается
// на нейтральную иконку-заглушку (UniversityIcon) — см. этот компонент.
//
// Статус: 41 из 41 вуза каталога покрыты. НЕ добавлять сюда логотип, в
// котором нет уверенности — лучше показать заглушку, чем ошибиться с
// брендингом вуза (важно: одно неопознанное присланное изображение —
// абстрактный красный полумесяц без текста — намеренно НЕ использовано,
// т.к. его нельзя было надёжно привязать к конкретному вузу; вместо него
// для METU взят более поздний, однозначно подписанный логотип).
// ---------------------------------------------------------------------------

export const UNIVERSITY_LOGOS: Record<string, string> = {
  "Astana IT University": "/university-logos/astana-it.png",
  "Bilkent University": "/university-logos/bilkent.png",
  "Bocconi University": "/university-logos/bocconi.png",
  "Carnegie Mellon University": "/university-logos/cmu.png",
  "Czech Technical University in Prague": "/university-logos/cvut.png",
  "ETH Zurich": "/university-logos/eth-zurich.png",
  "HEC Paris": "/university-logos/hec-paris.png",
  "HKUST (Hong Kong University of Science and Technology)": "/university-logos/hkust.png",
  "Imperial College London": "/university-logos/imperial.png",
  KAIST: "/university-logos/kaist.png",
  "KBTU (Казахстанско-Британский технический университет)": "/university-logos/kbtu.png",
  "KTH Royal Institute of Technology": "/university-logos/kth.png",
  "Khalifa University": "/university-logos/khalifa.png",
  "London School of Economics": "/university-logos/lse.png",
  "Massachusetts Institute of Technology": "/university-logos/mit.png",
  "Middle East Technical University (METU)": "/university-logos/metu.png",
  "NYU Abu Dhabi": "/university-logos/nyu-abu-dhabi.png",
  "Nanyang Technological University": "/university-logos/ntu.png",
  "National University of Singapore": "/university-logos/nus.png",
  "Nazarbayev University": "/university-logos/nazarbayev.png",
  "New York University (Stern)": "/university-logos/nyu-stern.png",
  "Politecnico di Milano": "/university-logos/polimi.png",
  "RWTH Aachen University": "/university-logos/rwth-aachen.png",
  "Satbayev University": "/university-logos/satbayev.png",
  "Seoul National University": "/university-logos/snu.png",
  "Stanford University": "/university-logos/stanford.png",
  "TU Delft": "/university-logos/tudelft.png",
  "Technical University of Munich": "/university-logos/tum.png",
  "Tsinghua University": "/university-logos/tsinghua.png",
  "UC Berkeley": "/university-logos/berkeley.png",
  "UNSW Sydney": "/university-logos/unsw.png",
  "University of Amsterdam": "/university-logos/amsterdam.png",
  "University of Cambridge": "/university-logos/cambridge.png",
  "University of Malaya": "/university-logos/university-malaya.png",
  "University of Melbourne": "/university-logos/melbourne.png",
  "University of Oxford": "/university-logos/oxford.png",
  "University of Pennsylvania (Wharton)": "/university-logos/wharton.png",
  "University of Tokyo": "/university-logos/tokyo.png",
  "University of Toronto": "/university-logos/toronto.png",
  "University of Waterloo": "/university-logos/waterloo.png",
  "École Polytechnique": "/university-logos/ecole-polytechnique.png",
};
