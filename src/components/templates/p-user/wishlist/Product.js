"use client";
import styles from "./product.module.css";
import Link from "next/link";
import { FaRegStar, FaStar } from "react-icons/fa";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Card = ({ product: { _id, price, score, name } }) => {
  const router = useRouter();

  const removeProduct = () => {
    swal({
      title: "آیا از حذف محصول اطمینان دارید؟",
      icon: "warning",
      buttons: ["نه", "آره"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/wishlist/${_id}`, { method: "DELETE" });
        if (res.status === 200) {
          toast.success("محصول از علاقه مندی های شما حذف شد ");
          router.refresh();
        }
      }
    });
  };

  return (
    <div className={styles.card}>
      <Link href={"/product/123"}>
        <img
          width={200}
          height={200}
          src="https://set-coffee.com/wp-content/uploads/2022/03/ethiopia-430x430.png"
          alt=""
        />
      </Link>
      <p dir="rtl">{name}</p>
      <div>
        <div>
          {score &&
            Array(score)
              .fill(0)
              .map((item, index) => <FaStar key={index + 1} />)}
          {score &&
            Array(5 - score)
              .fill(0)
              .map((item, index) => <FaRegStar key={index + 1} />)}
        </div>
        <span>{price?.toLocaleString()} تومان</span>
      </div>
      <button onClick={removeProduct} className={styles.delete_btn}>
        حذف محصول{" "}
      </button>
    </div>
  );
};

export default Card;
