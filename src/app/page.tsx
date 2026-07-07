"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Composer, type ComposerState } from "@/components/Composer";
import { homeComposerSuggestions, spaces } from "@/config/spaces";
import { spacePages } from "@/config/spacePages";
import { currentUser } from "@/config/user";
import { getGreeting } from "@/lib/greeting";
import type { SpaceConfig } from "@/types/space";

function SpaceTile({ space }: { space: SpaceConfig }) {
  const content = (
    <>
      <span className={styles.tileIcon}>
        <Image src={space.iconSrc} alt="" width={79} height={79} />
        {space.hasNotification && <span className={styles.notificationDot} />}
      </span>
      <span className={styles.tileLabel}>{space.label}</span>
    </>
  );

  if (spacePages[space.id]) {
    return (
      <Link href={`/spaces/${space.id}`} className={styles.spaceTile}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.spaceTile} disabled>
      {content}
    </button>
  );
}

export default function Home() {
  const [composerState, setComposerState] = useState<ComposerState>("idle");
  const greeting = getGreeting(currentUser.name, new Date());
  const isComposerFocused = composerState === "focused";

  return (
    <main className={styles.frame}>
      <div className={styles.datePill}>
        <bdi>شنبه ۲۵ اردیبهشت</bdi>
      </div>

      <HamburgerMenu />

      <div className={`${styles.pageContent} ${isComposerFocused ? styles.pageContentRaised : ""}`}>
        <div className={styles.mascot}>
          <Image src="/images/mascot.png" alt="" width={92} height={88} priority />
        </div>

        <div className={styles.greeting}>
          <p className={styles.greetingLine1}>{greeting.line1}</p>
          <p className={styles.greetingLine2}>{greeting.line2}</p>
        </div>

        <div className={`${styles.spaceGridRow} ${styles.spaceGridRow1}`}>
          {spaces.slice(0, 4).map((space) => (
            <SpaceTile key={space.id} space={space} />
          ))}
        </div>

        <div className={`${styles.spaceGridRow} ${styles.spaceGridRow2}`}>
          {spaces.slice(4, 8).map((space) => (
            <SpaceTile key={space.id} space={space} />
          ))}
        </div>
      </div>

      <Composer suggestions={homeComposerSuggestions} onStateChange={setComposerState} />
    </main>
  );
}
