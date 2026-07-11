"use client";

import { useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import { motion } from "motion/react";
import { TickCircle } from "iconsax-react";
import { RENTAL_DISTRICT_6_NEIGHBORHOODS } from "@/lib/mocks/rentalHouse";
import styles from "./RentalMapSelector.module.css";

type RentalMapSelectorProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const DOUBLE_TAP_MS = 280;

type PinchMemo = { startScale: number; startX: number; startY: number; originX: number; originY: number };
type DragMemo = { x: number; y: number };

export function RentalMapSelector({ selectedIds, onChange }: RentalMapSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ scale: MIN_SCALE, x: 0, y: 0 });
  const lastTapAt = useRef(0);
  const [{ scale, x, y }, api] = useSpring(() => ({ scale: MIN_SCALE, x: 0, y: 0 }));

  function clamp(nextScale: number, nextX: number, nextY: number) {
    const el = containerRef.current;
    if (!el) return { x: nextX, y: nextY };
    const { width, height } = el.getBoundingClientRect();
    const maxX = (width * (nextScale - 1)) / 2;
    const maxY = (height * (nextScale - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, nextX)),
      y: Math.min(maxY, Math.max(-maxY, nextY)),
    };
  }

  function resetZoom() {
    offset.current = { scale: MIN_SCALE, x: 0, y: 0 };
    api.start({ scale: MIN_SCALE, x: 0, y: 0 });
  }

  function toggleCell(id: string) {
    const next = selectedIds.includes(id) ? selectedIds.filter((existing) => existing !== id) : [...selectedIds, id];
    onChange(next);
  }

  function handlePointerDown() {
    const now = Date.now();
    if (now - lastTapAt.current < DOUBLE_TAP_MS) {
      resetZoom();
      lastTapAt.current = 0;
    } else {
      lastTapAt.current = now;
    }
  }

  useGesture(
    {
      onPinch: ({ origin: [ox, oy], first, offset: [s], memo }) => {
        const el = containerRef.current;
        if (!el) return memo;

        const m: PinchMemo = first
          ? (() => {
              const rect = el.getBoundingClientRect();
              return {
                startScale: offset.current.scale,
                startX: offset.current.x,
                startY: offset.current.y,
                originX: ox - (rect.left + rect.width / 2),
                originY: oy - (rect.top + rect.height / 2),
              };
            })()
          : memo;

        const ratio = s / m.startScale;
        const nextX = m.originX - (m.originX - m.startX) * ratio;
        const nextY = m.originY - (m.originY - m.startY) * ratio;
        const clamped = clamp(s, nextX, nextY);

        offset.current = { scale: s, ...clamped };
        api.start({ scale: s, x: clamped.x, y: clamped.y, immediate: true });
        return m;
      },
      onDrag: ({ pinching, first, last, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], memo }) => {
        if (pinching) return memo;
        if (offset.current.scale <= MIN_SCALE) return memo;

        const start: DragMemo = first ? { x: offset.current.x, y: offset.current.y } : memo;
        const clamped = clamp(offset.current.scale, start.x + mx, start.y + my);
        offset.current = { ...offset.current, ...clamped };

        if (last) {
          api.start({ x: clamped.x, y: clamped.y, config: { velocity: [vx * dx, vy * dy], decay: true } });
        } else {
          api.start({ x: clamped.x, y: clamped.y, immediate: true });
        }
        return start;
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      pinch: { scaleBounds: { min: MIN_SCALE, max: MAX_SCALE }, rubberband: true },
      drag: { filterTaps: true },
    },
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.mapCard} ref={containerRef} onPointerDown={handlePointerDown}>
        <animated.div className={styles.zoomLayer} style={{ x, y, scale }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.mapImage} src="/rental/geo/district-6-map.png" alt="" draggable={false} />

          <div className={styles.grid}>
            {RENTAL_DISTRICT_6_NEIGHBORHOODS.map((cell) => {
              const isSelected = selectedIds.includes(cell.id);
              return (
                <button
                  key={cell.id}
                  type="button"
                  className={`${styles.cell} ${isSelected ? styles.cellSelected : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => toggleCell(cell.id)}
                >
                  <motion.span
                    className={styles.checkBadge}
                    initial={false}
                    animate={
                      isSelected
                        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                        : { opacity: 0, scale: 0.25, filter: "blur(4px)" }
                    }
                    transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                  >
                    <TickCircle variant="Bold" size={16} color="#3b93eb" />
                  </motion.span>
                  <span className={styles.label}>{cell.label}</span>
                </button>
              );
            })}
          </div>
        </animated.div>
      </div>

      <p className={styles.hint}>روی نقشه محله‌های موردنظرت رو انتخاب کن</p>
    </div>
  );
}
