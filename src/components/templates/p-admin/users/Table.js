"use client";

import React, { useState } from "react";
import styles from "./table.module.css";
import { roles } from "@/utils/constants";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import EditModal from "@/components/modules/p-admin/UserEditModal";

export default function Table({ users, title }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const hideModal = () => setShowModal(false);

  const changingRole = async (userID) => {
    const res = await fetch(`/api/user/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });

    if (res.status === 200) {
      toast.success("نقش کاربر با موفقیت تغییر کرد");
      router.refresh();
    }
  };

  const deleteHandler = async (userID) => {
    swal({
      text: "از حذف کاربر اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "بله"],
    }).then(async (value) => {
      if (value) {
        const res = await fetch(`/api/user/${userID}`, { method: "DELETE" });
        if (res.status === 200) {
          toast.success(" کاربر با موفقیت حذف شد");
          router.refresh();
        }
      }
    });
  };

  const banHandler = async (phone, email) => {
    swal({
      text: " این کاربر مسدود شود",
      icon: "warning",
      buttons: ["نه", "بله"],
    }).then(async (value) => {
      if (value) {
        const res = await fetch(`/api/user/ban`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, email }),
        });

        if (res.status === 200) {
          toast.success(" کاربر با موفقیت بلاک شد");
          router.refresh();
        }
      }
    });
  };

  const handleDisplayModal = async (user) => {
    setShowModal(true);
    setUserId(user._id);
  };

  const updateUser = async (inputData) => {
    setSubmitting(true);

    const res = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...inputData }),
    });

    setSubmitting(false);

    if (res.status === 200) {
      toast.success("اطلاعات کاربر با موفقیت آپدیت شد");
      setTimeout(() => {
        setShowModal(false);
        router.refresh();
      }, 2000);
    }
  };

  return (
    <>
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
                <th>نام و نام خانوادگی</th>
                <th>ایمیل</th>
                <th>نقش</th>
                <th>ویرایش</th>
                <th> سطح دسترسی</th>
                <th>حذف</th>
                <th>بن</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email ? user.email : "ایمیل ثبت نشده"}</td>
                  <td>{user.role === roles.USER ? "کاربر عادی" : "مدیر"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDisplayModal(user)}
                      className={styles.edit_btn}
                    >
                      ویرایش
                    </button>
                  </td>
                  <td>
                    <button type="button" onClick={() => changingRole(user._id)} className={styles.edit_btn}>
                      تغییر نقش
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => deleteHandler(user._id)}
                      className={styles.delete_btn}
                    >
                      حذف
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => banHandler(user.phone, user.email)}
                      className={user?.isBanned ? styles.ban_btn : styles.delete_btn}
                    >
                      {user?.isBanned ? "⛔" : "بن"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <EditModal
          title=" آپدیت اطلاعات کاربر "
          hideModal={hideModal}
          updateUser={updateUser}
          isSubmitting={isSubmitting}
          userId={userId}
        />
      )}
    </>
  );
}
