import React from "react";
import DataTable from "@/templates/p-user/comments/DataTable";
import connectToDB from "@/data/db";
import CommentModel from "@/models/Comment";
import { authUser } from "@/utils/serverActions";
import styles from "@/styles/p-user/dataTable.module.css";

export default async function userCommentsPage() {
  connectToDB();

  const user = await authUser();

  let comments = [];

  if (user) {
    comments = await CommentModel.find({ userID: user._id }, "-__v")
      .populate("productID", "name")
      .populate("userID", "name")
      .lean();
  }

  return (
    <main>
      {comments.length > 0 ? (
        <DataTable comments={JSON.parse(JSON.stringify(comments))} title="لیست کامنت‌ها" />
      ) : (
        <p className={styles.empty}>کامنتی وجود ندارد</p>
      )}
    </main>
  );
}
