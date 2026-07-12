import Image from "next/image";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { currentUser } from "@/config/user";
import { getGreeting } from "@/lib/greeting";
import styles from "./GreetingPill.module.css";

/**
 * `HamburgerMenu` positions its trigger *and* its backdrop/drawer as
 * `position: absolute` against its nearest positioned DOM ancestor — nesting
 * it inside the pill's own absolutely-positioned box would make the pill
 * (56px tall) the drawer's containing block instead of the full page frame.
 * Rendered as a sibling instead (via the outer fragment), both pieces stay
 * absolute against `.frame` and just sit visually adjacent, matching the
 * pill's height via `className`-driven coordinates without touching
 * HamburgerMenu itself.
 */
export function GreetingPill() {
  const greeting = getGreeting(currentUser.name, new Date());

  return (
    <>
      <div className={styles.pill}>
        <Image src="/images/mascot.png" alt="" width={27} height={26} className={styles.mascot} priority />
        <p className={styles.text}>{greeting.line1}</p>
      </div>
      <HamburgerMenu className={styles.menuTrigger} />
    </>
  );
}
