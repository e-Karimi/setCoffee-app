import React, { useEffect, useState } from "react";
import styles from "./product-details-modal.module.css";
import { IoClose } from "react-icons/io5";

export default function ProductDetailsModal({ hideModal, productId }) {
  const [product, setProduct] = useState({});
  console.log("ProductDetailsModal ~ product:", product)

  useEffect(() => {
    const getAProduct = async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (res.status === 200) {
        const data = await res.json();
        setProduct(data.product);
      }
    };

    getAProduct();
  }, []);

  return (
    <div className={styles.modal}>
      <div onClick={hideModal} className={styles.modal_overlay}></div>
      <div className={styles.modal_main}>
        <div className={styles.modal_header}>
          <h3>{product?.name}:</h3>
          <IoClose onClick={hideModal} />
        </div>
        <div className={styles.details_table}>
          <div className={styles.line_table}>
            <h4>قیمت :</h4>
            <p>{product?.price?.toLocaleString()}</p>
          </div>
          <div className={styles.line_table}>
            <h4>وزن :</h4>
            <p>{product?.weight}</p>
          </div>
          <div className={styles.line_table}>
            <h4>امتیاز :</h4>
            <p>{product?.score}</p>
          </div>
          <div className={styles.line_table}>
            <h4>بو :</h4>
            <p>{product?.smell}</p>
          </div>
          <div className={styles.line_table}>
            <h4>کاربرد :</h4>
            <p>{product?.suitableFor}</p>
          </div>
          <div className={styles.line_table}>
            <h4>موجودی :</h4>
            <p>{product?.stock}</p>
          </div>
          <div className={styles.line_table}>
            <h4>توضیحات (خلاصه) </h4>
            <p className={styles.text}>: {product?.shortDescription}</p>
          </div>
          <div className={styles.line_table}>
            <h4>توضیحات (کامل) </h4>
            <p className={styles.text}>: {product?.longDescription}</p>
          </div>
          <div className={styles.line_table}>
            <h4> تگها  </h4>
            <p className={styles.text}>:{product?.tags?.length > 0 && product?.tags.join()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
