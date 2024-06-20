"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./table.module.css";
import { IoMdClose } from "react-icons/io";

export default function CartItem({ cart, item, calcTotalPrice, setCart }) {
  const [itemTotalPrice, setItemTotalPrice] = useState(0);
  const [count, setCount] = useState(item?.count);

  useEffect(() => {
    calcItemPrice(item);
    calcTotalPrice(cart);
  }, [item]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const targetItem = cart.find((product) => product._id === item._id);
    targetItem.count = count;
    localStorage.setItem("cart", JSON.stringify(cart));

    setCart(cart);
    calcTotalPrice(cart);
    calcItemPrice(targetItem);
  }, [count]);

  function calcItemPrice(item) {
    setItemTotalPrice(item?.count * item?.price);
  }

  const deleteItem = () => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const updatedCart = cart.filter((product) => product._id !== item._id);

    localStorage.setItem("cart", JSON.stringify(newCart));

    setCart(updatedCart);
    calcTotalPrice(updatedCart);
  };

  const minusHandler = () => {
    setCount((prevCount) => {
      if (prevCount - 1 === 0) {
        deleteItem();
        return prevCount - 1;
      } else {
        return prevCount - 1;
      }
    });
  };

  return (
    <tr>
      <td>{itemTotalPrice.toLocaleString()} تومان</td>
      <td className={styles.counter}>
        <div>
          <span onClick={minusHandler}>-</span>
          <p>{count && count}</p>
          <span onClick={() => setCount((prev) => prev + 1)}>+</span>
        </div>
      </td>
      <td className={styles.price}>{item.price.toLocaleString()} تومان</td>
      <td className={styles.product}>
        <img src="https://set-coffee.com/wp-content/uploads/2020/12/Red-box-DG--430x430.jpg" alt="" />
        <Link href={"/"}>{item.name}</Link>
      </td>

      <td onClick={deleteItem}>
        <IoMdClose className={styles.delete_icon} />
      </td>
    </tr>
  );
}
