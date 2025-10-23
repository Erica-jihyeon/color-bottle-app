"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Types ---------- */
type Bottle = {
  id: string;
  name: string;
  image: string;
  meaning?: string;
};

/* ---------- Brand / Color Map (타이틀/배경 등에 사용) ---------- */
const colorMap: Record<string, string> = {
  Red: "#D32F2F",
  Orange: "#F57C00",
  Yellow: "#FBC02D",
  Green: "#388E3C",
  Blue: "#1976D2",
  Indigo: "#3F51B5",
  Violet: "#8E24AA",
  Turquoise: "#0097A7",
  Pink: "#E91E63",
  Gold: "#FFD700",
  "White/Clear": "#BDBDBD",
  Magenta: "#C2185B",
};

/* ---------- Data: 12 bottles (이미지는 /public에 "1. bottle.png" ~ "12. bottle.png") ---------- */
const DEFAULT_BOTTLES: Bottle[] = [
  {
    id: "1",
    name: "Red",
    image: "/1. bottle.png",
    meaning:
      "동기부여가 필요함, 움직이고 싶음, 에너지가 필요함, 현실적인 힘/도움, 희생과 사랑의 이슈, 열정, 대담함, 자립, 노력, 극복, 과거",
  },
  {
    id: "2",
    name: "Orange",
    image: "/2. bottle.png",
    meaning:
      "도전이 필요함, 성취, 마무리, 자존감 이슈, 변화가 필요하다고 느낌, 사교성, 대인관계 이슈, 즐거움, 통찰과 지혜, 감수성, 실천, 자유로움",
  },
  {
    id: "3",
    name: "Yellow",
    image: "/3. bottle.png",
    meaning:
      "새로운 것을 배우고자 함, 호기심, 행복에 관한 이슈, 가능성과 의지, 새로운 변화, 시작, 행복함, 희망, 명료함, 판단, 순수함, 기쁨, 존재감, 긍정, 인정",
  },
  {
    id: "4",
    name: "Green",
    image: "/4. bottle.png",
    meaning:
      "몸과 마음의 균형, 성장이 필요함, 마음을 열고 소통, 휴식이 필요함, 평온함, 안정, 건강, 끈기, 공감, 협력, 진정성, 배려, 여유, 오픈마인드, 공간",
  },
  {
    id: "5",
    name: "Blue",
    image: "/5. bottle.png",
    meaning:
      "이해를 바탕으로 한 소통, 자기 신뢰, 정직/청렴의 이슈, 책임감, 꿈과 이상, 차분함, 프로세스, 기다림, 정신적 휴식, 가능성, 설득, 해소, 신뢰",
  },
  {
    id: "6",
    name: "Indigo",
    image: "/6. bottle.png",
    meaning:
      "몰입, 정신적 파워, 이성적인, 무한한 가능성, 미래에 대한 고민/생각, 불면증, 집중, 판단 및 통찰력, 차분함, 전문성, 초연함, 성실함, 실행력, 성숙함",
  },
  {
    id: "7",
    name: "Violet",
    image: "/7. bottle.png",
    meaning:
      "자유, 현실에서 벗어난, 우아함, 치유, 나를 찾고 싶은 마음, 품위, 급작스러운 변화, 영감, 예술적, 초월한, 회복력, 고귀함, 조화와 균형, 겸손, 봉사, 창조",
  },
  {
    id: "8",
    name: "Turquoise",
    image: "/8. bottle.png",
    meaning:
      "마음을 터놓는 편안한 소통, 솔직함, 나를 발견하고 싶은 마음, 독립, 생각할 시간, 여행, 떠나고 싶음, 섬세한, 나 혼자, 나에 대한 생각, 새로운 시작, 창조적인, 미래에 대한 희망",
  },
  {
    id: "9",
    name: "Pink",
    image: "/9. bottle.png",
    meaning:
      "용기, 무조건적인 사랑, 양육, 초월, 나를 사랑하는 마음(자기애), 나에 대한 생각, 사랑에 관한 이슈, 인정, 여성적, 섬세한, 치유와 케어",
  },
  {
    id: "10",
    name: "Gold",
    image: "/10. bottle.png",
    meaning:
      "실천, 결실, 확고한 의지, 깨달음/성찰과 관련된 이슈, 풍요로움, 충만함, 단단한 내면의 힘, 예민한 감수성, 감각적(감지), 조건 없는 기쁨과 삶, 지혜, 행복, 환희",
  },
  {
    id: "11",
    name: "White/Clear",
    image: "/11. bottle.png",
    meaning:
      "위로, 완벽함, 전환과 해결, 새로운 시작, 겪음을 통한 이해, 용기, 비워냄, 정화, 명료, 덜어냄, 희생, 설렘, 멈춤, 방향성, 투명함, 순수",
  },
  {
    id: "12",
    name: "Magenta",
    image: "/12. bottle.png",
    meaning:
      "정신적&육체적 에너지, 케어, 명확함, 관심과 사랑, 여성성, 감사함, 수용, 매력, 인내, 특별함, 포용하는 마음",
  },
];

/* ---------- Grid Card ---------- */
const BottleCard = ({
  bottle,
  onSelect,
}: {
  bottle: Bottle;
  onSelect: (id: string) => void;
}) => (
  <motion.button
    layoutId={`card-${bottle.id}`}
    onClick={() => onSelect(bottle.id)}
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 250, damping: 20 }}
    className="group relative w-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-200/40"
  >
    <div className="flex h-56 items-center justify-center">
      <motion.img
        layoutId={`bottle-${bottle.id}`}
        src={bottle.image}
        alt={bottle.name}
        className="max-h-full max-w-full object-contain drop-shadow-sm"
        draggable={false}
      />
    </div>
    <div className="mt-3 flex items-center justify-center">
      <motion.h3
        layoutId={`name-${bottle.id}`}
        className="text-base font-semibold text-gray-600"
      >
        {bottle.name}
      </motion.h3>
    </div>
  </motion.button>
);

/* ---------- Detail View ---------- */
const BottleDetail = ({
  bottle,
  onBack,
}: {
  bottle: Bottle;
  onBack: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const accent = colorMap[bottle.name] ?? "#7E57C2";
  const softBg = `${accent}20`; // 8자리 HEX(투명도 약 12%)

  return (
    <motion.div
      layoutId={`card-${bottle.id}`}
      className="relative rounded-3xl p-4 md:p-6"
      style={{ background: `linear-gradient(135deg, ${softBg}, #ffffff)` }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 text-sm text-zinc-800 shadow-sm backdrop-blur hover:bg-white"
        >
          ← 뒤로
        </button>

        <motion.h2
          layoutId={`name-${bottle.id}`}
          className="text-2xl font-extrabold tracking-tight md:text-3xl"
          style={{ color: accent }}
        >
          {bottle.name}
        </motion.h2>

        <div />
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        {/* 병 이미지 */}
        <motion.div
          layoutId={`bottle-${bottle.id}`}
          className="flex items-center justify-center"
        >
          <img
            src={bottle.image}
            alt={bottle.name}
            className="w-48 h-auto md:w-64 object-contain rounded-2xl border border-zinc-200 bg-white/95 shadow-md p-6"
            draggable={false}
          />
        </motion.div>

        {/* 의미 카드 */}
        <div className="space-y-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
            aria-expanded={open}
          >
            {open ? "컬러의 의미 닫기" : "컬러의 의미 살펴보기"}
          </button>

          <AnimatePresence initial={false} mode="wait">
            {open && (
              <motion.div
                key="meaning"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-zinc-200 bg-white/95 p-6 shadow-md backdrop-blur"
              >
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: accent }}
                >
                  {bottle.name}의 의미
                </h3>

                <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-zinc-900">
                  {(bottle.meaning ?? "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- Main Component ---------- */
export default function ColorBottleTarotApp({
  bottles = DEFAULT_BOTTLES,
}: {
  bottles?: Bottle[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = useMemo(() => bottles, [bottles]);
  const selected = items.find((b) => b.id === selectedId) || null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-12">
      {/* 상단 헤더 */}
      <header className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-center">
        <div>
          <h1 className="bg-gradient-to-r from-[#C8B6E2] via-[#F5C6EC] to-[#B8E0D2] bg-clip-text text-3xl font-extrabold leading-tight text-transparent md:text-4xl">
            컬러 바틀 선택
          </h1>
          <p className="mt-1 text-[15px] leading-relaxed text-zinc-900">
            12개의 바틀 중 마음이 가는 하나를 선택해 보세요.
          </p>
        </div>

        {!selected && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-xl border border-zinc-200 bg-white/90 px-4 py-2 text-sm text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
            >
              초기화
            </button>
          </div>
        )}
      </header>

      {/* 리스트 / 상세 전환 */}
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((bottle) => (
              <BottleCard key={bottle.id} bottle={bottle} onSelect={setSelectedId} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <BottleDetail bottle={selected} onBack={() => setSelectedId(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 푸터 */}
      <footer className="mt-14 text-center text-xs text-zinc-700">
        © {new Date().getFullYear()} UDUL STUDIO - 컬러인포스
      </footer>
    </div>
  );
}
