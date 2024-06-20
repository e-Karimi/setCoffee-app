import React from "react";
import styles from "./p-user-layout.module.css";
import Sidebar from "@/modules/p-user/Sidebar";
import Topbar from "@/modules/p-user/Topbar";
import { authUser } from "@/utils/serverActions";
import { redirect } from "next/navigation";

export default async function userPanelLayout({ children }) {
  const user = await authUser();

  if (!user) {
    redirect("/login-register");
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <Sidebar name={user.name} />
        <div className={styles.contents}>
          <Topbar name={user.name} />
          {children}
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: `پنل کاربری `,
  description: "پنل کاربری سایت ست کافی",
};
