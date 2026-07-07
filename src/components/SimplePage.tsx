import Link from "next/link";
import { Home } from "iconsax-react";
import styles from "./SimplePage.module.css";

type SimplePageProps = {
  title: string;
};

/* Minimal placeholder frame for routes the drawer links to that don't have a
   real build yet (profile, settings) — just enough that the link isn't dead. */
export function SimplePage({ title }: SimplePageProps) {
  return (
    <main className={styles.frame}>
      <Link href="/" className={styles.homeButton} aria-label="خانه">
        <Home variant="Linear" size={20} color="currentColor" />
      </Link>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
      </div>
    </main>
  );
}
