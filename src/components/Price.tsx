import { NumericText } from "@/components/NumericText";
import styles from "./Price.module.css";

type PriceProps = {
  /** Pre-formatted Persian-digit amount, e.g. via faNum() or formatPersianNumber(). */
  amount: string;
  unit?: string;
  className?: string;
};

/**
 * Groups an amount with its currency/unit word without the unit inheriting
 * the amount's heavy weight or tight numeral tracking.
 */
export function Price({ amount, unit = "تومان", className }: PriceProps) {
  return (
    <span className={className ? `${styles.price} ${className}` : styles.price}>
      <NumericText className={styles.amount}>{amount}</NumericText>
      <span className={styles.unit}>{unit}</span>
    </span>
  );
}
