"use client";

import { useMemo, useState } from "react";
import type { UserProfile } from "@/types/intelligence";
import styles from "./AdminSidebar.module.css";

type AdminSidebarProps = {
  users: UserProfile[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
};

export function AdminSidebar({ users, selectedUserId, onSelectUser }: AdminSidebarProps) {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return users;
    return users.filter((u) => u.name.includes(trimmed));
  }, [users, query]);

  const vipUsers = filteredUsers.filter((u) => u.isVip);
  const recentUsers = filteredUsers.slice(0, 2);

  return (
    <aside className={styles.sidebar}>
      <input
        className={styles.search}
        type="text"
        placeholder="جستجوی کاربر..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {vipUsers.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>کاربران ویژه</h3>
          <UserList users={vipUsers} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>کاربران اخیر</h3>
        <UserList users={recentUsers} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>همه کاربران</h3>
        <UserList users={filteredUsers} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />
      </section>

      <section className={styles.stubSection}>
        <h3 className={styles.sectionTitle}>گفتگوهای فعال</h3>
        <p className={styles.stubText}>به‌زودی</p>
      </section>

      <section className={styles.stubSection}>
        <h3 className={styles.sectionTitle}>بررسی‌های ذخیره‌شده</h3>
        <p className={styles.stubText}>به‌زودی</p>
      </section>
    </aside>
  );
}

function UserList({
  users,
  selectedUserId,
  onSelectUser,
}: {
  users: UserProfile[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}) {
  return (
    <ul className={styles.userList}>
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            className={`${styles.userRow} ${user.id === selectedUserId ? styles.selected : ""}`}
            onClick={() => onSelectUser(user.id)}
          >
            <span className={styles.avatar}>{user.name.charAt(0)}</span>
            <span className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userStatus}>{user.statusLine}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
