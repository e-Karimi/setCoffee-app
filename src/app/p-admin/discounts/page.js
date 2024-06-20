import React from "react";
import DiscountModel from "@/models/Discount";
import ProductModel from "@/models/Product";
import connectedToDB from "@/data/db";
import Table from "@/templates/p-admin/discounts/Table";
import AddDiscount from "@/templates/p-admin/discounts/AddDiscount";
import styles from "@/templates/p-admin/discounts/table.module.css";
import { Toaster } from "react-hot-toast";

export default async function discountPage() {
  connectedToDB();

  const discounts = await DiscountModel.find({}).sort({ _id: -1 }).lean();
  const products = await ProductModel.find({}, "name");

  return (
    <>
      <main className={styles.main}>
        <AddDiscount products={JSON.parse(JSON.stringify(products))} />

        {discounts.length === 0 ? (
          <p className={styles.empty}>کد تخفیفی وجود ندارد</p>
        ) : (
          <Table discounts={JSON.parse(JSON.stringify(discounts))} title="لیست تخفیفات" />
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
