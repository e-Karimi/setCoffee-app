"use client";

import React, { useState } from "react";
import styles from "./tabs.module.css";
import Link from "next/link";

export default function TabsHeader({ acceptedCommentsCount }) {
  const [tab, setTab] = useState("description");
  console.log("TabsHeader ~ tab:", tab);

  return (
    <>
      <Link  href="#!" className={tab === "description" ? styles.active_tab : ""} onClick={() => setTab("description")}>
        توضیحات
      </Link>
      <button className={tab === "moreInfoes" ? styles.active_tab : ""} onClick={() => setTab("moreInfoes")}>
        اطلاعات بیشتر
      </button>

      <button className={tab === "comments" ? styles.active_tab : ""} onClick={() => setTab("comments")}>
        نظرات ({acceptedCommentsCount})
      </button>
    </>
  );
}
