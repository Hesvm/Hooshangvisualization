"use client";

import { useState } from "react";
import Image from "next/image";
import { InfoCircle, ShieldTick, TickCircle, Truck, Refresh, Chart, Star1, TrendUp } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import { Price } from "@/components/Price";
import { NumericText } from "@/components/NumericText";
import { AffordabilityForecastChart } from "./AffordabilityForecastChart";
import type { ShoppingProduct } from "@/types/shopping";
import styles from "./FinalRecommendationCard.module.css";

type FinalRecommendationCardProps = {
  product: ShoppingProduct;
};

export function FinalRecommendationCard({ product }: FinalRecommendationCardProps) {
  const [matchDetailsExpanded, setMatchDetailsExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <ComponentHeader title="انتخاب مناسب تو" tone="accent" className={styles.labelHeader} />

      <div className={styles.heroFrame}>
        <div className={styles.imageSlot}>
          <Image
            className={styles.productImage}
            src={product.imageSrc}
            alt={product.imageAlt}
            width={320}
            height={220}
            sizes="(max-width: 430px) 76vw, 360px"
          />
        </div>
      </div>

      <div className={styles.identityBlock}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.config}>{product.configuration}</div>
        <div className={styles.price}>
          <Price amount={faNum(product.price)} unit="میلیون تومان" />
        </div>
      </div>

      <div className={styles.matchBlock}>
        <div className={styles.matchRow}>
          <span className={styles.matchScore}>
            <NumericText>{faNum(product.matchScore)}٪</NumericText> مناسب نیاز تو
          </span>
          <button
            type="button"
            className={styles.matchInfoButton}
            aria-label="جزئیات تطابق"
            onClick={() => setMatchDetailsExpanded((v) => !v)}
          >
            <InfoCircle variant="Bold" size={17} color="currentColor" />
          </button>
        </div>
        {matchDetailsExpanded && (
          <div className={styles.matchBreakdown}>
            {product.matchBreakdown.map((item) => (
              <div key={item.label} className={styles.matchBreakdownRow}>
                <span className={styles.matchBreakdownLabel}>{item.label}:</span>
                <span className={styles.matchBreakdownVerdict}>{item.verdict}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>چرا این گزینه؟</div>
        <ul className={styles.list}>
          {product.recommendationReasons.map((r) => (
            <li key={r} className={styles.listItem}>
              <span className={styles.listDot} aria-hidden />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {product.affordability && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>چرا الان برای تو به‌صرفه‌ست؟</div>
          <div className={styles.affordabilityBlock}>
            <div className={styles.affordabilityVerdictRow}>
              <span className={styles.affordabilityVerdictIcon}>
                <TrendUp variant="Bold" size={18} color="var(--color-success)" />
              </span>
              <span className={styles.affordabilityVerdict}>{product.affordability.verdict}</span>
            </div>

            {product.affordability.reasons.map((reason) => (
              <p key={reason} className={styles.affordabilityText}>
                {reason}
              </p>
            ))}

            {product.affordability.forecast.length === 2 && (
              <div className={styles.savingsBadge}>
                <NumericText className={styles.savingsAmount}>
                  {faNum(
                    product.affordability.forecast[1].price - product.affordability.forecast[0].price
                  )}
                </NumericText>
                <span>میلیون تومان صرفه‌جویی نسبت به خرید {product.affordability.forecast[1].label}</span>
              </div>
            )}

            <div className={styles.forecastLabel}>روند قیمت پیش‌بینی‌شده</div>
            <AffordabilityForecastChart forecast={product.affordability.forecast} />
          </div>
        </div>
      )}

      <div className={`${styles.section} ${styles.limitationsSection}`}>
        <div className={styles.sectionTitle}>چه محدودیت‌هایی داره؟</div>
        <ul className={styles.list}>
          {product.limitations.map((l) => (
            <li key={l} className={styles.listItem}>
              <span className={styles.listDot} aria-hidden />
              {l}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.trustBlock}>
        <ComponentHeader title="خرید مطمئن از دیجی‌کالا" logo="/images/brands/digikala-logo.svg" className={styles.trustHeader} />

        <div className={styles.trustRow}>
          <span className={styles.trustIcon}><TickCircle variant="Bold" size={16} color="var(--color-digikala-red)" /></span>
          <span>{product.seller}</span>
        </div>
        <div className={styles.trustRow}>
          <span className={styles.trustIcon}><Chart variant="Bold" size={16} color="var(--color-digikala-red)" /></span>
          <span>{faNum(product.sellerSatisfaction)}٪ رضایت از فروشنده</span>
        </div>
        <div className={styles.trustRow}>
          <span className={styles.trustIcon}><Truck variant="Bold" size={16} color="var(--color-digikala-red)" /></span>
          <span>
            {product.fulfilledByDigikala ? "ارسال توسط دیجی‌کالا" : "ارسال توسط فروشنده"} · {product.deliveryEstimate}
          </span>
        </div>
        <div className={styles.trustRow}>
          <span className={styles.trustIcon}><ShieldTick variant="Bold" size={16} color="var(--color-digikala-red)" /></span>
          <span>{product.authenticityGuarantee ? "تضمین اصالت کالا" : ""}</span>
        </div>
        <div className={styles.trustRow}>
          <span className={styles.trustIcon}><Refresh variant="Bold" size={16} color="var(--color-digikala-red)" /></span>
          <span>{faNum(product.returnWindowDays)} روز امکان بازگشت</span>
        </div>
        <div className={styles.trustRow}>
          <span className={styles.trustIcon}><Star1 variant="Bold" size={16} color="var(--color-digikala-red)" /></span>
          <span>
            امتیاز {faNum(product.rating)} از ۵ · بر اساس {faNum(product.reviewCount)} نظر خریدار
          </span>
        </div>
      </div>
    </div>
  );
}
