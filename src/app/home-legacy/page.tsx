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

const SPACES_PER_ROW = 4;

function SpaceTile({ space }: { space: SpaceConfig }) {
  const content = (
    <>
      <span className={styles.tileIcon}>
        <Image
          className={space.id === "kharid-supermarketi" ? styles.groceryTileImage : undefined}
          src={space.iconSrc}
          alt=""
          width={79}
          height={79}
        />
        {space.hasNotification && <span className={styles.notificationDot} />}
      </span>
      <span className={`${styles.tileLabel} ${space.id === "kharid-supermarketi" ? styles.groceryTileLabel : ""}`}>
        {space.label}
      </span>
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

export default function HomeLegacy() {
  const [composerState, setComposerState] = useState<ComposerState>("idle");
  const greeting = getGreeting(currentUser.name, new Date());
  const isComposerFocused = composerState === "focused";
  const visibleSpaces = spaces.slice(0, SPACES_PER_ROW * 2);
  const spaceRows = Array.from({ length: Math.ceil(visibleSpaces.length / SPACES_PER_ROW) }, (_, index) =>
    visibleSpaces.slice(index * SPACES_PER_ROW, index * SPACES_PER_ROW + SPACES_PER_ROW),
  );

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

        {spaceRows.map((row, index) => (
          <div
            key={index}
            className={`${styles.spaceGridRow} ${styles[`spaceGridRow${index + 1}`] ?? ""}`}
          >
            {row.map((space) => (
              <SpaceTile key={space.id} space={space} />
            ))}
          </div>
        ))}
      </div>

      <Composer suggestions={homeComposerSuggestions} onStateChange={setComposerState} />
    </main>
  );
}
