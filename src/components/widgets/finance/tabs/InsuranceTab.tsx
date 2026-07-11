"use client";

import { Car, HeartAdd, ShieldTick } from "iconsax-react";
import { NumericText } from "@/components/NumericText";
import { formatTomanCompact } from "@/lib/faNum";
import { INSURANCE_POLICIES } from "@/lib/mocks/financeInsurance";
import type { InsurancePolicy } from "@/types/finance";
import tabStyles from "./tabs.module.css";
import styles from "./InsuranceTab.module.css";

const ICON_BY_TYPE: Record<InsurancePolicy["icon"], typeof Car> = {
  car: Car,
  health: HeartAdd,
  life: ShieldTick,
};

const ICON_CLASS_BY_TYPE: Record<InsurancePolicy["icon"], string> = {
  car: styles.iconCar,
  health: styles.iconHealth,
  life: styles.iconLife,
};

export function InsuranceTab() {
  return (
    <div className={tabStyles.stack}>
      {INSURANCE_POLICIES.map((policy) => {
        const Icon = ICON_BY_TYPE[policy.icon];
        return (
          <div key={policy.id} className={styles.card}>
            <span className={`${styles.icon} ${ICON_CLASS_BY_TYPE[policy.icon]}`} aria-hidden="true">
              <Icon variant="Bold" size={20} color="currentColor" />
            </span>
            <div className={styles.text}>
              <span className={styles.label}>{policy.label}</span>
              <span className={styles.coverage}>{policy.coverage}</span>
              <span className={styles.renewal}>تمدید: {policy.renewalDate}</span>
            </div>
            <div className={styles.premium}>
              <span className={styles.premiumAmount}>
                <NumericText>{formatTomanCompact(policy.premium)}</NumericText>
              </span>
              <span className={styles.premiumLabel}>حق بیمه سالانه</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
