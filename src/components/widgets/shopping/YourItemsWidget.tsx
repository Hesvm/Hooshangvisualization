import shared from "@/components/widgets/shared.module.css";
import styles from "./ShoppingWidgets.module.css";

export function YourItemsWidget() {
  return <div className={`${shared.card} ${styles.whiteCard} ${styles.yourItemsCard}`} />;
}
