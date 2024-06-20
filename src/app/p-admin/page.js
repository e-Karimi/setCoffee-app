import React from "react";
import styles from "@/styles/p-admin/index.module.css";
import { Toaster } from "react-hot-toast";
import Box from "@/components/modules/box/Box";

import ProductModel from "@/models/Product";
import TicketModel from "@/models/Ticket";
import UserModel from "@/models/User";
import connectToDB from "@/data/db";

import GrowthChart from "@/templates/p-admin/index/GrowthChart";
import SaleChart from "@/templates/p-admin/index/SaleChart";

export default async function adminPanelPage() {
  connectToDB();

  const tickets = await TicketModel.find({}).lean();
  const users = await UserModel.find({}).lean();
  const products = await ProductModel.find({}).lean();

  return (
    <main>
      <section className={styles.dashboard_contents}>
        <Box title="مجموع تیکت های دریافتی" value={tickets.length} />
        <Box title="مجموع محصولات سایت" value={products.length} />
        <Box title="مجموع سفارشات" value="333" />
        <Box title="مجموع کاربر های سایت" value={users.length} />
      </section>{" "}
      <div className={styles.dashboard_charts}>
        <section>
          <p>آمار فروش</p>
          <SaleChart />
        </section>
        <section>
          <p>نرخ رشد</p>
          <GrowthChart />
        </section>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            padding: "8px ",
            minWidth: "250px",
            fontSize: "13.5px",
            borderRadius: "5px",
          },
        }}
      />
    </main>
  );
}
