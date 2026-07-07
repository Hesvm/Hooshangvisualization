"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Edit, SearchNormal, Message, Gallery, Setting } from "iconsax-react";
import { DrawerRow } from "./DrawerRow";
import { spaces } from "@/config/spaces";
import { spacePages } from "@/config/spacePages";
import { currentUser } from "@/config/user";
import { drawerHistoryGroups } from "@/lib/mocks/drawerHistory";
import styles from "./Drawer.module.css";

type DrawerProps = {
  onNavigate: () => void;
};

export function Drawer({ onNavigate }: DrawerProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return drawerHistoryGroups;
    return drawerHistoryGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((historyItem) => historyItem.title.includes(query.trim())),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div className={styles.content}>
      <div className={styles.topActions}>
        <DrawerRow icon={<Edit variant="Linear" size={22} color="currentColor" />} label="گفت‌وگوی جدید" brand onClick={onNavigate} />
        <DrawerRow
          icon={<SearchNormal variant="Linear" size={22} color="currentColor" />}
          label="جستجو"
          brand
          onClick={() => setSearchOpen((v) => !v)}
        />
      </div>

      {searchOpen && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در گفت‌وگوها…"
          autoFocus
          className={styles.searchInput}
        />
      )}

      <div className={styles.divider} />

      {filteredGroups.map((group) => (
        <div className={styles.section} key={group.label}>
          <p className={styles.sectionLabel}>{group.label}</p>
          {group.items.map((historyItem) => (
            <DrawerRow
              key={historyItem.id}
              icon={
                historyItem.threadType === "media" ? (
                  <Gallery variant="Linear" size={22} color="currentColor" />
                ) : (
                  <Message variant="Linear" size={22} color="currentColor" />
                )
              }
              label={historyItem.title}
              href={historyItem.href}
              selected={Boolean(historyItem.href) && historyItem.href === pathname}
              onClick={onNavigate}
            />
          ))}
        </div>
      ))}

      <div className={styles.divider} />

      <div className={styles.section}>
        <p className={styles.sectionLabel}>فضاها</p>
        {spaces.map((space) => (
          <DrawerRow
            key={space.id}
            icon={<Image src={space.iconSrc} alt="" width={22} height={22} />}
            label={space.label}
            href={`/spaces/${space.id}`}
            disabled={!spacePages[space.id]}
            onClick={onNavigate}
          />
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <DrawerRow
          icon={<span className={styles.avatar}>{currentUser.name.charAt(0)}</span>}
          label={currentUser.name}
          href="/profile"
          onClick={onNavigate}
        />
        <DrawerRow icon={<Setting variant="Linear" size={22} color="currentColor" />} label="تنظیمات" href="/settings" onClick={onNavigate} />
      </div>
    </div>
  );
}
