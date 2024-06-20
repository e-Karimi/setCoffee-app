"use client";

import React, { useState } from "react";
import styles from "./details.module.css";
import toast from "react-hot-toast";

export default function AddToCart({ product }) {
  const [count, setCount] = useState(1);

  const addToCartHandler = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length) {
      const productExists = cart.some((item) => item._id === product._id);
      if (productExists) {
        cart.map((item) => {
          if (item._id === product._id) {
            item.count = item.count + count;
          }
          return;
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success("محصول به سبد خرید شما اضافه شد");
      } else {
        addNewItem(cart);
      }
    } else {
      addNewItem(cart);
    }
  };

  function addNewItem(cart) {
    const newItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      count,
    };

    cart.push(newItem);

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("محصول به سبد خرید شما اضافه شد");
  }

  return (
    <div className={styles.cart}>
      <button onClick={addToCartHandler}>افزودن به سبد خرید</button>
      <div>
        <span onClick={() => setCount((prev) => prev - 1)}>-</span>
        {count}
        <span onClick={() => setCount((prev) => prev + 1)}>+</span>
      </div>
    </div>
  );
}
