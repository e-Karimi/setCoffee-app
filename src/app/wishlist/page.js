import Link from "next/link";
import Breadcrumb from "@/modules/breadcrumb/Breadcrumb";
import Footer from "@/modules/footer/Footer";
import Navbar from "@/modules/navbar/Navbar";
import Product from "@/modules/product/Product";
import { FaRegHeart } from "react-icons/fa";

import { authUser } from "@/utils/serverActions";
import WishlistModel from "@/models/Wishlist";
import connectedToDB from "@/data/db";

import styles from "@/styles/wishlist.module.css";

export default async function wishlistPage() {
  connectedToDB();

  let favorits = [];

  const user = await authUser();

  if (user) {
    favorits = await WishlistModel.find({ userID: user._id })
      .populate("productID", "name price score")
      .lean();
  }

  return (
    <>
      <Navbar isLogined={user ? true : false} />
      <Breadcrumb route={"علاقه مندی ها"} />
      <main className={styles.container} data-aos="fade-up">
        <p className={styles.title}>محصولات مورد علاقه شما</p>
        <section>
          {favorits.length > 0 &&
            favorits.map((favorit) => (
              <Product key={favorit._id} product={JSON.parse(JSON.stringify(favorit.productID))} />
            ))}
        </section>
      </main>

      {favorits.length === 0 && (
        <div className={styles.wishlist_empty} data-aos="fade-up">
          <FaRegHeart />
          <p>محصولی یافت نشد</p>
          <span>شما هنوز هیچ محصولی در لیست علاقه مندی های خود ندارید.</span>
          <span>در صفحه "فروشگاه" محصولات جالب زیادی پیدا خواهید کرد.</span>
          <div>
            <Link href="/category">بازگشت به فروشگاه</Link>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
