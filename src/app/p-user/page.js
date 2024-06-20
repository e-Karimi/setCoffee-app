import React from "react";
import styles from "@/styles/p-user/index.module.css";

import Box from "@/components/modules/box/Box";
import Tickets from "@/templates/p-user/index/Tickets";
import Orders from "@/templates/p-user/index/Orders";
import { Toaster } from "react-hot-toast";

import CommentModel from "@/models/Comment";
import TicketModel from "@/models/Ticket";
import WishlistModel from "@/models/Wishlist";
import { authUser } from "@/utils/serverActions";

export default async function userPanelPage() {
  const user = await authUser();

  const userTickets = await TicketModel.find({ user: user._id })
    .limit(3)
    .sort({ _id: -1 })
    .populate("department", "name")
    .lean();

  const userComments = await CommentModel.find({ userID: user._id });
  const userWishes = await WishlistModel.find({ userID: user._id });

  return (
    <main>
      <section className={styles.boxes}>
        <Box title="مجموع تیکت ها " value={userTickets.length} />
        <Box title="مجموع کامنت ها " value={userComments.length} />
        <Box title="مجموع سفارشات" value="0" />
        <Box title="مجموع علاقه مندی ها" value={userWishes.length} />
      </section>
      <section className={styles.contents}>
        <Tickets tickets={JSON.parse(JSON.stringify(userTickets))} />
        <Orders />
      </section>
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
