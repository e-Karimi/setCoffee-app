import React from "react";
import styles from "@/templates/p-admin/users/table.module.css";
import Table from "@/templates/p-admin/users/Table";
import connectToDB from "@/data/db";
import UserModel from "@/models/User";
import { Toaster } from "react-hot-toast";

const usersPage = async () => {
  connectToDB();
  const users = await UserModel.find({}).lean();

  return (
    <>
      <main>
        {users.length === 0 ? (
          <p className={styles.empty}>کاربری وجود ندارد</p>
        ) : (
          <Table users={JSON.parse(JSON.stringify(users))} title="لیست کاربران" />
        )}
      </main>
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
    </>
  );
};

export default usersPage;
