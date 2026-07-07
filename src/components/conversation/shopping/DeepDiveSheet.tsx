"use client";

import { useState } from "react";
import { faNum } from "@/lib/faNum";
import { PRODUCT_ROLE_LABEL, type ShoppingProduct } from "@/types/shopping";
import styles from "./DeepDiveSheet.module.css";

type DeepDiveSheetProps = {
  product: ShoppingProduct;
  otherProducts: ShoppingProduct[];
  onSelectAsFinal: (productId: string) => void;
};

const ASK_REPLY =
  "الان اطلاعات دقیق‌تری از این جزئیات ندارم، اما همین چیزهایی که بالاتر گفتم قابل‌اعتمادترین خلاصه‌ایه که دارم.";

/** Focused view of one shortlist product, rendered inside the shared BottomSheet. */
export function DeepDiveSheet({ product, otherProducts, onSelectAsFinal }: DeepDiveSheetProps) {
  const [compareOpen, setCompareOpen] = useState(false);
  const [trackAcknowledged, setTrackAcknowledged] = useState(false);
  const [askText, setAskText] = useState("");
  const [askReplyShown, setAskReplyShown] = useState(false);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.imageSlot} aria-hidden>
          {product.imageGlyph}
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.config}>{product.configuration}</div>
          <div className={styles.priceRow}>
            <span className={styles.price}>{faNum(product.price)} میلیون تومان</span>
            <span className={styles.rolePill}>{PRODUCT_ROLE_LABEL[product.role]}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>مناسب چه کسیه؟</div>
        <p className={styles.sectionText}>{product.suitableFor}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>برای تو مناسبه؟</div>
        <p className={styles.sectionText}>{product.personalizedFitText}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>نقاط قوت</div>
        <ul className={styles.list}>
          {product.strengths.map((s) => (
            <li key={s} className={styles.listItem}>
              <span className={styles.listDot} aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>محدودیت‌ها</div>
        <ul className={styles.list}>
          {product.limitations.map((l) => (
            <li key={l} className={styles.listItem}>
              <span className={styles.listDot} aria-hidden />
              {l}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>خلاصه نظر خریدارها</div>
        <p className={styles.sectionText}>{product.buyerReviewSummary}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionButton} onClick={() => setCompareOpen((v) => !v)}>
          با گزینه‌های دیگه مقایسه کن
        </button>
        {compareOpen && (
          <div className={styles.compareList}>
            {otherProducts.map((p) => (
              <div key={p.id} className={styles.compareRow}>
                <div className={styles.compareName}>{p.name}</div>
                <div className={styles.comparePrice}>
                  {faNum(p.price)} میلیون تومان · {PRODUCT_ROLE_LABEL[p.role]}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className={styles.actionButton}
          disabled={trackAcknowledged}
          style={{ opacity: trackAcknowledged ? 0.6 : 1 }}
          onClick={() => setTrackAcknowledged(true)}
        >
          قیمتش رو دنبال کن
        </button>
        {trackAcknowledged && <div className={styles.ackNote}>باشه، قیمتش رو برات دنبال می‌کنم و اگه تغییر کرد بهت خبر می‌دم.</div>}

        <button type="button" className={`${styles.actionButton} ${styles.actionPrimary}`} onClick={() => onSelectAsFinal(product.id)}>
          این گزینه رو انتخاب کن
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>درباره این لپ‌تاپ چی می‌خوای بدونی؟</div>
        <div className={styles.askForm}>
          <input
            className={styles.askInput}
            placeholder="سؤالت رو بنویس..."
            value={askText}
            onChange={(e) => setAskText(e.target.value)}
          />
          <button
            type="button"
            className={styles.askSubmit}
            disabled={!askText.trim()}
            onClick={() => setAskReplyShown(true)}
          >
            پرسیدن
          </button>
        </div>
        {askReplyShown && <div className={styles.ackNote}>{ASK_REPLY}</div>}
      </div>
    </div>
  );
}
