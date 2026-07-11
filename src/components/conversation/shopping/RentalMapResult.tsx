"use client";

import { useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import { AnimatePresence, motion } from "motion/react";
import { Add, Bag2, Bus, Car, Chart, Minus, Tree, Wallet } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import {
  RENTAL_MAP_LAYERS,
  RENTAL_PROPERTIES,
  TEHRAN_DISTRICTS,
  formatRentalPrice,
  rentalPropertyPhoto,
  type RentalMapLayerId,
  type RentalProperty,
} from "@/lib/mocks/rentalHouse";
import styles from "./RentalMapResult.module.css";

const LAYER_ICON: Record<RentalMapLayerId, typeof Car> = {
  traffic: Car,
  green: Tree,
  metro: Bus,
  services: Bag2,
  price: Wallet,
  elevation: Chart,
};

const MEDALS = ["🥇", "🥈", "🥉"];

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.7;
const CARD_ZOOM_THRESHOLD = 1.85;
const DOUBLE_TAP_MS = 280;

type PinchMemo = { startScale: number; startX: number; startY: number; originX: number; originY: number };
type DragMemo = { x: number; y: number };

const EASE = [0.22, 0.61, 0.36, 1] as const;

const listVariants = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.08 } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15, ease: EASE } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } },
};

function districtLabel(districtId: string): string {
  return TEHRAN_DISTRICTS.find((d) => d.id === districtId)?.label ?? "";
}

function propertyById(id: string): RentalProperty | undefined {
  return RENTAL_PROPERTIES.find((p) => p.id === id);
}

type RentalMapResultProps = {
  onViewProperty: (propertyId: string) => void;
};

export function RentalMapResult({ onViewProperty }: RentalMapResultProps) {
  const [activeLayerId, setActiveLayerId] = useState<RentalMapLayerId>(RENTAL_MAP_LAYERS[0].id);
  const [zoomLevel, setZoomLevel] = useState(MIN_SCALE);
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ scale: MIN_SCALE, x: 0, y: 0 });
  const lastTapAt = useRef(0);
  const [{ scale, x, y }, api] = useSpring(() => ({ scale: MIN_SCALE, x: 0, y: 0 }));

  const activeLayer = RENTAL_MAP_LAYERS.find((layer) => layer.id === activeLayerId) ?? RENTAL_MAP_LAYERS[0];
  const properties = activeLayer.propertyIds.map(propertyById).filter((p): p is RentalProperty => Boolean(p));
  const showMiniCards = zoomLevel >= CARD_ZOOM_THRESHOLD;

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

  function applyZoom(nextScale: number) {
    const clamped = clamp(nextScale, offset.current.x, offset.current.y);
    offset.current = { scale: nextScale, ...clamped };
    setZoomLevel(nextScale);
    api.start({ scale: nextScale, x: clamped.x, y: clamped.y });
  }

  function zoomIn() {
    applyZoom(Math.min(MAX_SCALE, offset.current.scale + ZOOM_STEP));
  }

  function zoomOut() {
    applyZoom(Math.max(MIN_SCALE, offset.current.scale - ZOOM_STEP));
  }

  function resetZoom() {
    applyZoom(MIN_SCALE);
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
        setZoomLevel(s);
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
    <div className={styles.card}>
      <ComponentHeader title="نقشه گزینه‌ها" tone="muted" />

      <div className={styles.layerRow}>
        {RENTAL_MAP_LAYERS.map((layer) => {
          const Icon = LAYER_ICON[layer.id];
          const active = layer.id === activeLayerId;
          return (
            <button
              key={layer.id}
              type="button"
              className={`${styles.layerChip} ${active ? styles.layerChipActive : ""}`}
              aria-pressed={active}
              onClick={() => setActiveLayerId(layer.id)}
            >
              <Icon variant="Bold" size={18} color="currentColor" />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.mapCard} ref={containerRef} onPointerDown={handlePointerDown}>
        <animated.div className={styles.zoomLayer} style={{ x, y, scale }}>
          <AnimatePresence>
            <motion.img
              key={activeLayer.id}
              className={styles.mapImage}
              src={activeLayer.image}
              alt=""
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            />
          </AnimatePresence>

          {properties.map((property, index) => (
            <motion.button
              key={`rank-${index}`}
              type="button"
              className={styles.marker}
              animate={{ left: `${property.markerX}%`, top: `${property.markerY}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={() => onViewProperty(property.id)}
              aria-label={property.title}
            >
              <motion.span
                className={`${styles.pin} ${index === 0 ? styles.pinPrimary : styles.pinSecondary}`}
                initial={false}
                animate={
                  showMiniCards
                    ? { opacity: 0, scale: 0.25, filter: "blur(4px)" }
                    : { opacity: 1, scale: 1, filter: "blur(0px)" }
                }
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                style={{ pointerEvents: showMiniCards ? "none" : "auto" }}
              >
                {faNum(index + 1)}
              </motion.span>

              <motion.span
                className={styles.pinCard}
                initial={false}
                animate={
                  showMiniCards
                    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, scale: 0.25, filter: "blur(4px)" }
                }
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                style={{ pointerEvents: showMiniCards ? "auto" : "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.pinCardPhoto} src={rentalPropertyPhoto(property.id)} alt="" draggable={false} />
                <span className={styles.pinCardBody}>
                  <span className={styles.pinCardTitle}>{property.title}</span>
                  <span className={styles.pinCardPrice}>{formatRentalPrice(property.rent)}</span>
                </span>
              </motion.span>
            </motion.button>
          ))}
        </animated.div>

        <div className={styles.zoomControls}>
          <button type="button" className={styles.zoomButton} aria-label="بزرگ‌نمایی" onClick={zoomIn}>
            <Add variant="Bold" size={18} color="currentColor" />
          </button>
          <button type="button" className={styles.zoomButton} aria-label="کوچک‌نمایی" onClick={zoomOut}>
            <Minus variant="Bold" size={18} color="currentColor" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeLayer.id}
          className={styles.list}
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {properties.map((property, index) => (
            <motion.div key={property.id} className={styles.propertyCard} variants={cardVariants}>
              <div className={styles.propertyHead}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.propertyPhoto} src={rentalPropertyPhoto(property.id)} alt="" draggable={false} />

                <div className={styles.propertyBody}>
                  <span className={styles.propertyTitle}>
                    {MEDALS[index]} {property.title}
                  </span>
                  <span className={styles.propertyMeta}>
                    {districtLabel(property.districtId)} · {faNum(property.area)} متر · {faNum(property.bedrooms)} خواب
                  </span>
                  {property.reason ? <span className={styles.reasonBadge}>{property.reason}</span> : null}
                </div>
              </div>

              <span className={styles.propertyPrices}>
                <span className={styles.propertyPriceRow}>
                  <span className={styles.priceLabel}>رهن</span>
                  <span className={styles.priceValue}>{formatRentalPrice(property.deposit)}</span>
                </span>
                <span className={styles.propertyPriceRow}>
                  <span className={styles.priceLabel}>اجاره</span>
                  <span className={styles.priceValue}>{formatRentalPrice(property.rent)}</span>
                </span>
              </span>

              <button type="button" className={styles.propertyCta} onClick={() => onViewProperty(property.id)}>
                مشاهده
              </button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
