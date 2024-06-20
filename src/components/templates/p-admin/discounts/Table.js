"use client";

import React from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Table({ discounts }) {
  const router = useRouter();

  const deleteHandler = async (discountID) => {
    swal({
      text: "از حذف کد تخفیف اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "بله"],
    }).then(async (value) => {
      if (value) {
        const res = await fetch(`/api/discounts/${discountID}`, { method: "DELETE" });
        if (res.status === 200) {
          toast.success(" کد تخفیف با موفقیت حذف شد");
          router.refresh();
        } else if (res.status === 401) {
          return toast.error(" شما به این صفحه دسترسی ندارید ", { id: "not-authorize" });
        } else if (res.status === 500) {
          return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
        }
      }
    });
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>شناسه</th>
          <th>کد</th>
          <th>درصد</th>
          <th> تاریخ انقضا</th>
          <th> نوع</th>
          <th>حذف</th>
        </tr>
      </thead>
      <tbody>
        {discounts.map((discount, index) => (
          <tr key={discount._id}>
            <td style={{ background: discount.expire === new Date() ? "#b80303" : "#fff" }}>{index + 1}</td>
            <td>{discount.code}</td>
            <td>{discount.percent}</td>
            <td>{new Date(discount.expire).toLocaleDateString("fa-IR")}</td>
            <td>تخفیف همگانی</td>
            <td>
              <button onClick={() => deleteHandler(discount._id)} type="button" className={styles.delete_btn}>
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
