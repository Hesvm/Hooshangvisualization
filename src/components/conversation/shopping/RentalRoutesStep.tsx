"use client";

import { useState } from "react";
import { RENTAL_ROUTE_SUGGESTIONS, RENTAL_ROUTES_CONTEXT_TEXT } from "@/lib/mocks/rentalHouse";
import styles from "./RentalRoutesStep.module.css";

type RentalRoutesStepProps = {
  routeIds: string[];
  customRoutes: string[];
  onChangeRouteIds: (ids: string[]) => void;
  onChangeCustomRoutes: (routes: string[]) => void;
};

export function RentalRoutesStep({ routeIds, customRoutes, onChangeRouteIds, onChangeCustomRoutes }: RentalRoutesStepProps) {
  const [customText, setCustomText] = useState("");

  function toggleRoute(id: string) {
    onChangeRouteIds(routeIds.includes(id) ? routeIds.filter((item) => item !== id) : [...routeIds, id]);
  }

  function addCustomRoute() {
    const value = customText.trim();
    if (!value) return;
    onChangeCustomRoutes([...customRoutes, value]);
    setCustomText("");
  }

  function removeCustomRoute(route: string) {
    onChangeCustomRoutes(customRoutes.filter((item) => item !== route));
  }

  return (
    <div>
      <p className={styles.contextText}>{RENTAL_ROUTES_CONTEXT_TEXT}</p>

      <div className={styles.chipRow}>
        {RENTAL_ROUTE_SUGGESTIONS.map((route) => {
          const selected = routeIds.includes(route.id);
          return (
            <button
              key={route.id}
              type="button"
              className={`${styles.chip} ${selected ? styles.chipSelected : ""}`}
              aria-pressed={selected}
              onClick={() => toggleRoute(route.id)}
            >
              {route.label}
            </button>
          );
        })}
        {customRoutes.map((route) => (
          <button key={route} type="button" className={`${styles.chip} ${styles.chipSelected}`} onClick={() => removeCustomRoute(route)}>
            {route}
          </button>
        ))}
      </div>

      <div className={styles.customRow}>
        <input
          className={styles.customInput}
          placeholder="یه مسیر دیگه بنویس..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomRoute();
            }
          }}
        />
        <button type="button" className={styles.addButton} disabled={!customText.trim()} onClick={addCustomRoute}>
          افزودن
        </button>
      </div>
    </div>
  );
}
