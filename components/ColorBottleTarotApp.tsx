"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- Helper: bottle image component ----
const Bottle = ({ image = "/1. bottle.png", label = "", className = "w-24 h-40" }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <img
      src={image}
      alt={label || "color bottle"}
      className="w-full h-full object-contain rounded-xl shadow-sm"
      draggable={false}
    />
    {label && <span className="mt-2 text-sm font-medium text-zinc-700">{label}</span>}
  </div>
);

// ---- Data: 12 bottles with image paths & names only ----
// Put your files under /public as: "1. bottle.png" ... "12. bottle.png"
const DEFAULT_BOTTLES = [
  { id: "1", name: "Red", image: "/1. bottle.png" },
  { id: "2", name: "Orange", image: "/2. bottle.png" },
  { id: "3", name: "Yellow", image: "/3. bottle.png" },
  { id: "4", name: "Green", image: "/4. bottle.png" },
  { id: "5", name: "Blue", image: "/5. bottle.png" },
  { id: "6", name: "Indigo", image: "/6. bottle.png" },
  { id: "7", name: "Violet", image: "/7. bottle.png" },
  { id: "8", name: "Turquoise", image: "/8. bottle.png" },
  { id: "9", name: "Pink", image: "/9. bottle.png" },
  { id: "10", name: "Gold", image: "/10. bottle.png" },
  { id: "11", name: "White/Clear", image: "/11. bottle.png" },
  { id: "12", name: "Magenta", image: "/12. bottle.png" },
];

// ---- Card ----
const BottleCard = ({ bottle, onSelect }: { bottle: any; onSelect: (id: string) => void }) => (
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
        className="max-h-full max-w-full object-contain"
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

// ---- Detail View ----
const BottleDetail = ({ bottle, onBack }: { bottle: any; onBack: () => void }) => (
  <motion.div layoutId={`card-${bottle.id}`} className="relative">
    <div className="mb-4 flex items-center gap-3">
      <button
        onClick={onBack}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
      >
        ← 뒤로
      </button>
      <motion.h2 layoutId={`name-${bottle.id}`} className="text-xl font-bold">
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
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">
            여기에 이 병(색)의 감정 키워드, 짧은 리딩(타로 느낌), 추천 활동 등을 넣을 수 있어요.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// ---- Main Component ----
export default function ColorBottleTarotApp({ bottles = DEFAULT_BOTTLES }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = useMemo(() => bottles, [bottles]);
  const selected = items.find((b) => b.id === selectedId) || null;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">컬러 바틀 선택</h1>
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
              <BottleCard key={bottle.id} bottle={bottle} onSelect={setSelectedId} />)
            )}
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
        © {new Date().getFullYear()} Color Bottle Tarot • Image Edition
      </footer>
    </div>
  );
}