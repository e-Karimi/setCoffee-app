"use client";

import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

export default function AddToFavorits({ productID, classname, isAleardyAddedToFavorites }) {
  const [user, setUser] = useState({});
  const [like, setLike] = useState(false);
  const [heartColor, setHeartColor] = useState("brown");
  const [message, setMessage] = useState(" افزودن به علاقه مندی ها");

  useEffect(() => {
    const authUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 200) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 401) {
        toast.error("برای افزودن به علاقه مندی ها ابتدا باید لاگین کنید");
      } else if (res.status === 404) {
        toast.error("کاربری با این ایمیل پیدا نشد");
      }
    };
    authUser();

    if (isAleardyAddedToFavorites) {
      setMessage("من این محصول را دوست دارم");
      setHeartColor("#bd0003");
      setLike(true);
    } else {
      setHeartColor("brown");
      setMessage(" افزودن به علاقه مندی ها");
      setLike(false);
    }
  }, []);

  const likeHandler = async () => {
    if (!user._id) {
      toast.error("برای اضافه کردن به علاقه مندی‌ها لطفا ابتدا لاگین بکنین");
      return;
    }

    //* Determind whether a product adds to the favorites  or  delete
    const res = await fetch(`/api/wishlist/${productID}`);

    if (res.status !== 200) {
      //*ADD PRODUCT TO THE FAVORITS
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productID, userID: user?._id }),
      });

      if (res.status === 201) {
        toast.success("محصول مورد نظر به علاقه‌مندی‌ها اضافه شد", { id: "favorit-added" });
        setMessage("من این محصول را دوست دارم");
        setHeartColor("#bd0003");
        setLike(true);
        return;
      } else if (res.status === 409) {
        toast.success("محصول مورد نظر قبلا به علاقه‌مندی‌های شما اضافه شده", { id: "already-added" });
        setLike(true);
        return;
      }
    } else {
      //*DELETE PRODUCT FROM THE FAVORITS
      const res = await fetch(`/api/wishlist/${productID}`, { method: "DELETE" });

      if (res.status === 200) {
        toast.success("محصول مورد نظر از علاقه‌مندی‌ها حذف شد");
        setHeartColor("brown");
        setMessage(" افزودن به علاقه مندی ها");
        setLike(false);
      }
    }
  };

  return (
    <div onClick={likeHandler} style={{ cursor: "pointer" }}>
      {like ? (
        <AiFillHeart style={{ color: heartColor }} />
      ) : (
        <AiOutlineHeart style={{ color: heartColor }} />
      )}
      <small className={classname}>{message}</small>
    </div>
  );
}
