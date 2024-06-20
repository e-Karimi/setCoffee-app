import React from "react";
import styles from "./p-admin-layout.module.css";
import Sidebar from "@/modules/p-admin/Sidebar";
import Topbar from "@/modules/p-admin/Topbar";
import { authUser } from "@/utils/serverActions";
import { redirect } from "next/navigation";
import { roles } from "@/utils/constants";


export default async function adminPanelLayout({ children }) {
  const user = await authUser();

  if (!user) {
    redirect("/login-register");
  }

  if (user?.role !== roles.ADMIN) {
    redirect("/p-user");
  }

  return (
    <div className={styles.layout} >
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
  title: `پنل ادمین `,
  description: "پنل ادمین سایت ست کافی",
};
