import React from "react";
import CommentModel from "@/models/Comment";
import connectedToDB from "@/data/db";
import styles from "@/templates/p-admin/comments/table.module.css";
import Table from "@/templates/p-admin/comments/Table";
import { Toaster } from "react-hot-toast";

export default async function commentsPage() {
  connectedToDB();

  const comments = await CommentModel.find()
    .sort({ _id: -1 })
    .populate("productID")
    .populate("userID")
    .lean();

  return (
    <>
      <main>
        {comments.length === 0 ? (
          <p className={styles.empty}>کامنتی وجود ندارد</p>
        ) : (
          <Table comments={JSON.parse(JSON.stringify(comments))} title="لیست کامنت‌ها" />
        )}
      </main>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            padding: "8px ",
            minWidth: "250px",
            fontSize: "13.5px",
            borderRadius: "5px",
          },
        }}
      />
    </>
  );
}
