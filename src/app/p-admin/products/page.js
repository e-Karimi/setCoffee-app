import React from "react";
import styles from "@/templates/p-admin/products/table.module.css";
import ProductModel from "@/models/Product";
import connectToDB from "@/data/db";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import AddProduct from "@/templates/p-admin/products/AddProduct";

const DynamicTable = dynamic(() => import("@/templates/p-admin/products/Table"), { ssr: false });

export default async function productPage() {
  connectToDB();
  const products = await ProductModel.find({}).sort({ _id: -1 }).lean();

  return (
    <>
      <main>
        <AddProduct />

        {products.length === 0 ? (
          <p className={styles.empty}>محصولی وجود ندارد</p>
        ) : (
          <DynamicTable products={JSON.parse(JSON.stringify(products))} title="لیست محصولات" />
        )}
      </main>
      <Toaster
        position="top-left"
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
