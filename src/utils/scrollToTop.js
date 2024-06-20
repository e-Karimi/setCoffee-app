"use client";
import { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import styles from "@/styles/ScrollToTop.module.css";

export default function ScrollToTop() {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const displayArrowUpBtn = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 300) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    };

    window.addEventListener("scroll", displayArrowUpBtn);

    return () => window.removeEventListener("scroll", displayArrowUpBtn);
  }, []);

  const HandleGoToTop = () => {
    isShow &&
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
  };

  return (
    <button className={isShow ? styles.buttonVisible : styles.button}>
      {" "}
      <MdKeyboardArrowUp onClick={HandleGoToTop} />
    </button>
  );
}
