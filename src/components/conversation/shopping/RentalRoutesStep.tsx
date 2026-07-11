"use client";

import { useState } from "react";
import { Add, Briefcase, Home2, Setting2, Star1, Teacher, Weight } from "iconsax-react";
import { ChevronLeft } from "@/components/icons/line";
import {
  RENTAL_ROUTES_CONTEXT_TEXT,
  RENTAL_ROUTE_SUGGESTIONS,
  type RentalRouteIcon,
} from "@/lib/mocks/rentalHouse";
import styles from "./RentalRoutesStep.module.css";

const ROUTE_ICON: Record<RentalRouteIcon, typeof Briefcase> = {
  work: Briefcase,
  university: Teacher,
  gym: Weight,
  family: Home2,
};

type RentalRoutesStepProps = {
  routeIds: string[];
  customRoutes: string[];
  onChangeRouteIds: (ids: string[]) => void;
  onChangeCustomRoutes: (routes: string[]) => void;
};

export function RentalRoutesStep({ routeIds, customRoutes, onChangeRouteIds, onChangeCustomRoutes }: RentalRoutesStepProps) {
  const [customText, setCustomText] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);

  function toggleRoute(id: string) {
    onChangeRouteIds(routeIds.includes(id) ? routeIds.filter((item) => item !== id) : [...routeIds, id]);
  }

  function addCustomRoute() {
    const value = customText.trim();
    if (!value) return;
    onChangeCustomRoutes([...customRoutes, value]);
    setCustomText("");
    setAddingCustom(false);
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.contextText}>{RENTAL_ROUTES_CONTEXT_TEXT}</p>

      <div className={styles.previewMap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.previewMapImage} src="/rental/geo/district-6-map.png" alt="" draggable={false} />
        {RENTAL_ROUTE_SUGGESTIONS.map((route) => {
          const Icon = ROUTE_ICON[route.icon];
          return (
            <span
              key={route.id}
              className={styles.previewPin}
              style={{ left: `${route.markerX}%`, top: `${route.markerY}%`, background: route.pinColor }}
            >
              <Icon variant="Bold" size={13} color="currentColor" />
            </span>
          );
        })}
      </div>

      <div className={styles.noteBubble}>
        <span className={styles.noteIcon}>
          <Setting2 variant="Bold" size={16} color="currentColor" />
        </span>
        <span className={styles.noteText}>
          وقتی مسیرهای مهمت رو بدونم، دقت پیشنهادهام درباره دسترسی و رفت‌وآمد بیشتر میشه.
        </span>
      </div>

      <div className={styles.list}>
        {RENTAL_ROUTE_SUGGESTIONS.map((route) => {
          const Icon = ROUTE_ICON[route.icon];
          const selected = routeIds.includes(route.id);
          return (
            <button
              key={route.id}
              type="button"
              className={`${styles.row} ${selected ? styles.rowSelected : ""}`}
              aria-pressed={selected}
              onClick={() => toggleRoute(route.id)}
            >
              <span className={styles.rowIcon} style={{ background: route.pinColor }}>
                <Icon variant="Bold" size={18} color="currentColor" />
              </span>
              <span className={styles.rowBody}>
                <span className={styles.rowTitle}>{route.label}</span>
                <span className={styles.rowLocation}>{route.location}</span>
              </span>
              <span className={styles.rowStars} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star1
                    key={i}
                    variant={i < route.rating ? "Bold" : "Linear"}
                    size={12}
                    color={i < route.rating ? "#f5a524" : "rgba(0,0,0,0.18)"}
                  />
                ))}
              </span>
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
          );
        })}

        {customRoutes.map((route) => (
          <button
            key={route}
            type="button"
            className={`${styles.row} ${styles.rowSelected}`}
            onClick={() => onChangeCustomRoutes(customRoutes.filter((item) => item !== route))}
          >
            <span className={styles.rowIcon} style={{ background: "#565f73" }}>
              <Home2 variant="Bold" size={18} color="currentColor" />
            </span>
            <span className={styles.rowBody}>
              <span className={styles.rowTitle}>{route}</span>
              <span className={styles.rowLocation}>مسیر دلخواه</span>
            </span>
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
        ))}
      </div>

      {addingCustom ? (
        <div className={styles.customRow}>
          <input
            autoFocus
            className={styles.customInput}
            placeholder="اسم مسیر رو بنویس..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomRoute();
              }
            }}
          />
          <button type="button" className={styles.addConfirmButton} disabled={!customText.trim()} onClick={addCustomRoute}>
            افزودن
          </button>
        </div>
      ) : (
        <button type="button" className={styles.addRouteButton} onClick={() => setAddingCustom(true)}>
          <Add size={18} color="currentColor" />
          افزودن مسیر جدید
        </button>
      )}
    </div>
  );
}
