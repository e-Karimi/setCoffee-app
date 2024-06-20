import React from "react";
import connectToDB from "@/data/db";
import TicketModel from "@/models/Ticket";
import Table from "@/templates/p-admin/tickets/Table";
import styles from "@/templates/p-admin/tickets/table.module.css";

export default async function ticketsPage() {
  connectToDB();

  const tickets = await TicketModel.find({ isAnswer: false })
    .sort({ _id: -1 })
    .populate("department")
    .populate("user")
    .lean();


  return (
    <main>
      {tickets.length === 0 ? (
        <p className={styles.empty}>تیکتی وجود ندارد</p>
      ) : (
        <Table tickets={JSON.parse(JSON.stringify(tickets))} title="لیست تیکت ها" />
      )}
    </main>
  );
}
