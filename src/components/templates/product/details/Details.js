import { FaFacebookF, FaStar, FaTwitter, FaRegStar } from "react-icons/fa";
import { FaTelegram, FaLinkedinIn, FaPinterest } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { TbSwitch3 } from "react-icons/tb";

import styles from "./details.module.css";
import Breadcrumb from "./Breadcrumb";
import AddToCart from "./AddToCart";
import AddToFavorits from "@/components/modules/addToFavorits/AddToFavorits";

import WishlistModel from "@/models/Wishlist";
import connectedToDB from "@/data/db";
import { authUser } from "@/utils/serverActions";

export default async function Details({ product, acceptedComments }) {
  //todo =>  Whether product is already  added to your Wishlist or not
  connectedToDB();

  const user = await authUser();

  let isAleardyAddedToFavorites = false;

  if (user) {
    let productExists = await WishlistModel.findOne({
      $and: [{ userID: user._id }, { productID: product._id }],
    });

    if (productExists) {
      isAleardyAddedToFavorites = true;
    } else {
      isAleardyAddedToFavorites = false;
    }
  }

  return (
    <main style={{ width: "63%" }}>
      <Breadcrumb title={product.name} />
      <h2>{product.name}</h2>

      <div className={styles.rating}>
        <div>
          {Array(product?.score)
            .fill(0)
            .map((item, index) => (
              <FaStar key={index + 1} />
            ))}
          {Array(5 - product?.score)
            .fill(0)
            .map((item, index) => (
              <FaRegStar key={index + 1} />
            ))}
        </div>
        <p>(دیدگاه{acceptedComments?.length} کاربر)</p>
      </div>

      <p className={styles.price}> {product.price?.toLocaleString()} تومان</p>
      <span className={styles.description}>{product.shortDescription}</span>

      <hr />

      <div className={styles.Available}>
        <IoCheckmark />
        <p>{product.stock > 0 ? " موجود در انبار" : "اتمام موجودی"}</p>
      </div>

      <AddToCart product={JSON.parse(JSON.stringify(product))} />

      <section className={styles.wishlist}>
        <AddToFavorits productID={product._id} isAleardyAddedToFavorites={isAleardyAddedToFavorites} />
        <div>
          <TbSwitch3 />
          <a href="/">مقایسه</a>
        </div>
      </section>

      <hr />

      <div className={styles.details}>
        <strong>شناسه محصول: {product._id}</strong>

        <p>
          <strong>برچسب:</strong>
          {product?.tags?.length > 0 && product.tags.toString()}
        </p>
      </div>

      <div className={styles.share}>
        <p>به اشتراک گذاری: </p>
        <a href="/">
          <FaTelegram />
        </a>
        <a href="/">
          <FaLinkedinIn />
        </a>
        <a href="/">
          <FaPinterest />
        </a>
        <a href="/">
          <FaTwitter />
        </a>
        <a href="/">
          <FaFacebookF />
        </a>
      </div>

      <hr />
    </main>
  );
}
