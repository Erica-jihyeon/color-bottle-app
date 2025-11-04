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
      "열정, 에너지, 추진력, 용기, 결단, 생동감, 자립, 강인함, 집중, 실행, 동기부여, 힘, 도움, 희생, 노력, 극복, 과거, 사랑, 확신",
  },
  {
    id: "2",
    name: "Orange",
    image: "/2. bottle.png",
    meaning:
      "도전, 변화, 자신감, 즐거움, 활력, 사교성, 모험, 표현, 자존감, 자유, 대인관계, 감수성, 실천, 통찰, 지혜",
  },
  {
    id: "3",
    name: "Yellow",
    image: "/3. bottle.png",
    meaning:
      "호기심, 명료함, 긍정, 자신감, 희망, 배움, 기쁨, 행복, 새로운 시작, 순수, 긍정, 인정, 존재감",
  },
  {
    id: "4",
    name: "Green",
    image: "/4. bottle.png",
    meaning:
      "몸과 마음의 균형, 안정, 휴식, 평온, 여유, 성장, 따뜻함, 공감, 수용, 회복, 마음을 연 소통, 끈기, 협력, 배려, 여유, 오픈마인드, 공간, 진정성",
  },
  {
    id: "5",
    name: "Blue",
    image: "/5. bottle.png",
    meaning:
      "신뢰, 진정성, 집중, 차분함, 책임감, 안정감, 휴식, 신중함, 명예, 성실, 이해를 바탕으로 한 소통, 자기 신뢰, 꿈, 이상, 기다림, 프로세스, 체계, 해소, 가능성, 설득, 정직, 청렴",
  },
  {
    id: "6",
    name: "Indigo",
    image: "/6. bottle.png",
    meaning:
      "통찰, 몰입, 집중, 사유, 전문성, 명상, 비전, 진지함, 직관, 심층 탐구, 무한한 가능성, 미래, 불면증, 차분함, 초연함, 성실함, 실행력, 성숙함, 이성적인, 정신적 힘",
  },
  {
    id: "7",
    name: "Violet",
    image: "/7. bottle.png",
    meaning:
      "치유, 영감, 변화, 우아함, 상상력, 창조성, 초월, 고요, 품위, 조화, 자유, 예술, 회복력, 고귀함, 조화화 균형, 겸손, 현실을 벗어난, 나를 찾고 싶은 마음, 봉사, 창조",
  },
  {
    id: "8",
    name: "Turquoise",
    image: "/8. bottle.png",
    meaning:
      "자유, 솔직함, 독립, 창조성, 섬세함, 감수성, 여정, 신선함, 유연함, 여행, 마음을 터놓는 소통, 나의 정체성, 생각할 시간, 떠나고 싶음, 나 혼자, 나에 대한 생각, 희망",
  },
  {
    id: "9",
    name: "Pink",
    image: "/9. bottle.png",
    meaning:
      "다정함, 자기애, 보호, 온기, 인정, 친절, 케어, 애정, 감수성, 부드러움, 용기, 무조건적인 사랑, 양육, 나에 대한 생각, 여성적, 섬세한, 치유",
  },
  {
    id: "10",
    name: "Gold",
    image: "/10. bottle.png",
    meaning:
      "풍요, 성찰, 깨달음, 확신, 내면의 힘, 통합, 충만함, 성숙, 감사, 안정, 실천, 결실, 확고한 의지, 감수성, 감각적(감지), 조건 없는 기쁨과 삶, 지혜, 행복, 환희",
  },
  {
    id: "11",
    name: "White/Clear",
    image: "/11. bottle.png",
    meaning:
      "비움, 명료함, 새출발, 정화, 순수, 투명함, 리셋, 간결함, 평온, 개방성, 위로, 완벽함, 전환과 해결, 겪음을 통한 이해, 용기, 비워냄, 덜어냄, 희생, 멈춤, 방향성",
  },
  {
    id: "12",
    name: "Magenta",
    image: "/12. bottle.png",
    meaning:
      "케어, 에너지, 활력, 포용, 인내, 감사, 진심, 애정, 헌신, 정신적 에너지, 육체적 에너지, 명확함, 관심과 사랑, 여성성, 수용, 매력, 특별함",
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
