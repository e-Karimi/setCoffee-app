"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import toast from "react-hot-toast";
import swal from "sweetalert";
import CommentEditModal from "@/modules/p-admin/CommentEditModal";
import { useRouter } from "next/navigation";

export default function Table({ comments, title }) {
  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();

  const hideModal = () => setShowModal(false);

  const showCommentBody = (body) => {
    swal({
      text: body,
      button: "خوندم",
    });
  };

  const deleteComment = async (commentID) => {
    swal({
      text: "از حذف کامنت اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "بله"],
    }).then(async (value) => {
      if (value) {
        const res = await fetch(`/api/comments/${commentID}`, { method: "DELETE" });
        if (res.status === 200) {
          toast.success(" کامنت با موفقیت حذف شد");
          router.refresh();
        }
      }
    });
  };

  const acceptComment = async (comment) => {
    const updatedItems = {
      commentID: comment._id,
      isAccepted: true,
    };

    const res = await fetch(`/api/comments/accept`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...updatedItems }),
    });

    if (res.status === 200) {
      const data = await res.json();
      toast.success("کامنت با موفقیت تایید شد");
      router.refresh();
    }
  };

  const rejectComment = async (comment) => {
    const updatedItems = {
      commentID: comment._id,
      isAccepted: false,
    };

    const res = await fetch(`/api/comments/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...updatedItems }),
    });

    if (res.status === 200) {
      toast.success("کامنت با موفقیت لغو شد");
      router.refresh();
    }
  };

  const displayEditModal = async (comment) => {
    setShowModal(true);
    setCommentId(comment._id);
    setUsername(comment.username);
  };

  const updateContent = async (data, commentId) => {
    if (!data.body.trim()) {
      toast.error("متن کامنت خالی است !!");
      return;
    }

    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    if (res.status === 200) {
      hideModal();
      toast.success("متن کامنت با موفقیت آپدیت شد");
    }
  };

  const answerToComment = async (comment) => {
    swal({
      text: `پاسخ به ${comment.username}`,
      content: {
        element: "input",
        attributes: {
          placeholder: "درج پاسخ...",
          type: "text",
        },
      },
    }).then(async (value) => {
      if (value?.trim()) {
        const answer = {
          body: value,
          score: 5,
          productID: comment.productID._id,
          isAccepted: true,
        };

        const res = await fetch(`/api/comments/${comment._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...answer }),
        });

        if (res.status === 200) {
          toast("پاسخ با موفقیت ثبت شد");
          router.refresh();
        }
      }
    });
  };

  const banHandler = async (email) => {
    swal({
      text: "این  کاربر مسدود شود؟",
      icon: "warning",
      buttons: ["نه", "بله"],
    }).then(async (value) => {
      if (value) {
        const res = await fetch(`/api/user/ban`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (res.status === 200) {
          toast.success(" کاربر با موفقیت بلاک شد");
          router.refresh();
        }
      }
    });
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
                <th>کاربر</th>
                <th>ایمیل</th>
                <th>امتیاز</th>
                <th>محصول</th>
                <th>تاریخ ثبت</th>
                <th>مشاهده</th>
                <th>ویرایش</th>
                <th>حذف</th>
                <th>تایید</th>
                <th>پاسخ</th>
                <th>بن</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, index) => (
                <tr key={comment._id}>
                  <td>{index + 1}</td>
                  <td>{comment.username}</td>
                  <td>{comment.email}</td>
                  <td>{comment.score}</td>
                  <td className={styles.product_name}>{comment.productID.name}</td>
                  <td>{new Date(comment.date).toLocaleDateString("fa-IR")}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.edit_btn}
                      onClick={() => showCommentBody(comment.body)}
                    >
                      مشاهده
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => displayEditModal(comment)}
                      type="button"
                      className={styles.edit_btn}
                    >
                      ویرایش
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteComment(comment._id)}
                      type="button"
                      className={styles.delete_btn}
                    >
                      حذف
                    </button>
                  </td>
                  <td>
                    {comment.isAccepted ? (
                      <button
                        onClick={() => rejectComment(comment)}
                        type="button"
                        className={styles.delete_btn}
                      >
                        <span>✅</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => acceptComment(comment)}
                        type="button"
                        className={styles.delete_btn}
                      >
                        تایید
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => answerToComment(comment)}
                      type="button"
                      className={styles.delete_btn}
                    >
                      {comment.hasAnswer ? <span>✅</span> : "پاسخ"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => banHandler(comment.email)}
                      type="button"
                      className={styles.delete_btn}
                    >
                      بن
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CommentEditModal
          title={`آپدیت کامنت ${username}`}
          hideModal={hideModal}
          updateContent={updateContent}
          isSubmitting={isSubmitting}
          commentId={commentId}
        />
      )}
    </>
  );
}
