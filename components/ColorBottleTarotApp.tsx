"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Bottle = {
  id: string;
  name: string;
  image: string;
  meaning?: string;
};

/* ---------- Data: 12 bottles (이미지는 /public 폴더에 "1. bottle.png" ~ "12. bottle.png") ---------- */
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
    className="group relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200"
  >
    <div className="flex h-52 items-center justify-center">
      <motion.img
        layoutId={`bottle-${bottle.id}`}
        src={bottle.image}
        alt={bottle.name}
        className="max-h-full max-w-full object-contain text-gray-600"
        draggable={false}
      />
    </div>
    <div className="mt-3 flex items-center justify-between">
      <motion.h3 layoutId={`name-${bottle.id}`} className="text-base font-semibold text-zinc-800">
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
  const [open, setOpen] = useState(false); // ← setOpen 정의

  return (
    <motion.div layoutId={`card-${bottle.id}`} className="relative">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          ← 뒤로
        </button>
        <motion.h2 layoutId={`name-${bottle.id}`} className="text-xl font-bold text-gray-600">
          {bottle.name}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div layoutId={`bottle-${bottle.id}`} className="flex items-center justify-center">
          <img
            src={bottle.image}
            alt={bottle.name}
            className="w-44 h-72 md:w-60 md:h-96 object-contain rounded-2xl border border-zinc-200 bg-white shadow-sm p-6"
            draggable={false}
          />
        </motion.div>

        {/* 우측 영역: 토글 버튼 + 의미 */}
        <div className="space-y-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
            aria-expanded={open}
          >
            {open ? "컬러의 의미 닫기" : "컬러의 의미 살펴보기"}
          </button>

          {open && (
            <motion.div
              key="meaning"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-600">{bottle.name}의 의미</h3>

              {/* 콤마(,)로 구분된 문자열을 보기 좋게 리스트로 표시 */}
              <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed text-zinc-700">
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
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- Main Component ---------- */
export default function ColorBottleTarotApp({ bottles = DEFAULT_BOTTLES }: { bottles?: Bottle[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = useMemo(() => bottles, [bottles]);
  const selected = items.find((b) => b.id === selectedId) || null;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-gray-600">컬러 바틀 선택</h1>
          <p className="mt-1 text-zinc-600">12개의 바틀 중 마음이 가는 하나를 선택해 보세요.</p>
        </div>
        {!selected && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              초기화
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((bottle) => (
              <BottleCard key={bottle.id} bottle={bottle} onSelect={setSelectedId} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <BottleDetail bottle={selected} onBack={() => setSelectedId(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-10 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} UDUL STUDIO
      </footer>
    </div>
  );
}
