import Link from "next/link";
import styles from "./product.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import AddToFavorits from "@/modules/addToFavorits/AddToFavorits";

export default function Card({ product }) {
  const { name, price, score } = product;

  return (
    <div className={styles.card}>
      <div className={styles.details_container}>
        <img src={product.img} alt="" />
        <div className={styles.icons}>
          <Link href={`/product/${product._id}`}>
            <CiSearch />
            <p className={styles.tooltip}>مشاهده سریع</p>
          </Link>
          <div>
            <AddToFavorits productID={JSON.parse(JSON.stringify(product._id))} classname={styles.tooltip} />
          </div>
        </div>
        <button>افزودن به سبد خرید</button>
      </div>

      <div className={styles.details}>
        <Link href={`/product/${product._id}`}> {name && name}</Link>
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
    </div>
  );
}
