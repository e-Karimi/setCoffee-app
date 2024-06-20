"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductDetailsModal from "@/modules/p-admin/ProductDetailsModal";
import ProductEditModal from "@/modules/p-admin/ProductEditModal";
import swal from "sweetalert";

export default function Table({ products, title }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productID, setProductID] = useState("");
  const router = useRouter();

  const displayDetailsModal = async (id) => {
    setShowDetailsModal(true);
    setProductID(id);
  };

  const displayEditModal = async (id) => {
    setShowEditModal(true);
    setProductID(id);
  };

  const hideModal = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
  };

  const deleteProduct = (productId) => {
    swal({
      text: "از حذف محصول اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "بله"],
    }).then(async (value) => {
      if (value) {
        const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
        if (res.status === 200) {
          toast.success(" محصول با موفقیت حذف شد");
          router.refresh();
        } else if (res.status === 404) {
          toast.error(" محصول پیدا نشد");
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
                <th>نام</th>
                <th>قیمت</th>
                <th>امتیاز</th>
                <th>سایر جزئیات</th>
                <th>ویرایش</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString()}</td>
                  <td>{product.score}</td>

                  <td>
                    <button
                      onClick={() => displayDetailsModal(product._id)}
                      type="button"
                      className={styles.edit_btn}
                    >
                      مشاهده 
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => displayEditModal(product._id)}
                      type="button"
                      className={styles.edit_btn}
                    >
                      ویرایش
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      type="button"
                      className={styles.delete_btn}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showDetailsModal && <ProductDetailsModal hideModal={hideModal} productId={productID} />}
      {showEditModal && (
        <ProductEditModal
          hideModal={hideModal}
          productId={JSON.parse(JSON.stringify(productID))}
          setShowEditModal={setShowEditModal}
        />
      )}
    </>
  );
}
