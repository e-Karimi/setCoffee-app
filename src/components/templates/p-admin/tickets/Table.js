"use client";

import React from "react";
import styles from "./table.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

export default function Table({ tickets, title }) {
  const router = useRouter();

  const showTicketBody = (body) => {
    swal({
      text: body,
      button: "خوندم",
    });
  };

  const answerToTicket = async (ticket) => {
    swal({
      text: `پاسخ به ${ticket?.user?.name}`,
      content: {
        element: "input",
        attributes: {
          placeholder: "درج پاسخ...",
          type: "text",
        },
      },
      buttons: ["لغو", "ارسال"],
    }).then(async (value) => {
      if (value?.trim()) {
        const answer = {
          ...ticket,
          body: value,
          department: ticket.department._id,
        };

        const res = await fetch(`/api/tickets/answer/${ticket._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...answer }),
        });

        if (res.status === 201) {
          toast("پاسخ با موفقیت ثبت شد");
          router.refresh();
        }
      }
    });
  };

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{title}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>تاریخ ثبت</th>
              <th>الویت</th>
              <th>کاربر</th>
              <th>عنوان</th>
              <th>دپارتمان</th>
              <th>مشاهده</th>
              <th>پاسخ</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</td>
                <td>
                  {ticket.priority === 1 && (
                    <span style={{ cursor: "pointer" }} title="الویت کم">
                      {" "}
                      🟣
                    </span>
                  )}
                  {ticket.priority === 2 && (
                    <span style={{ cursor: "pointer" }} title="الویت متوسط">
                      {" "}
                      🟡
                    </span>
                  )}
                  {ticket.priority === 3 && (
                    <span style={{ cursor: "pointer" }} title="الویت بالا">
                      {" "}
                      🔴
                    </span>
                  )}
                </td>
                <td>{ticket.user.name}</td>
                <td>{ticket.title}</td>
                <td>{ticket.department.name}</td>
                <td>
                  <button
                    type="button"
                    className={styles.edit_btn}
                    onClick={() => showTicketBody(ticket.body)}
                  >
                    مشاهده
                  </button>
                </td>
                <td>
                  <button onClick={() => answerToTicket(ticket)} type="button" className={styles.delete_btn}>
                    {ticket.hasAnswer ? <span>✅</span> : "پاسخ"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
