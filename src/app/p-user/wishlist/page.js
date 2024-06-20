import dynamic from "next/dynamic";
const NoSSRProduct = dynamic(() => import("@/templates/p-user/wishlist/Product"), { ssr: false });

import Link from "next/link";
import { authUser } from "@/utils/serverActions";
import WishlistModel from "@/models/Wishlist";
import connectedToDB from "@/data/db";
import styles from "@/styles/p-user/wishlist.module.css";
import { Toaster } from "react-hot-toast";

export default async function userWishlistPage() {
  connectedToDB();

  const user = await authUser();

  let favorits = await WishlistModel.find({ userID: user._id })
    .populate("productID", "name price score")
    .lean();

  return (
    <>
      <main>
        <h1 className={styles.title}>
          <span>علاقه مندی ها</span>
        </h1>
        <div className={styles.container}>
          {favorits.length > 0 &&
            favorits.map((favorit) => (
              <NoSSRProduct key={favorit._id} product={JSON.parse(JSON.stringify(favorit.productID))} />
            ))}
        </div>

        <div className={styles.empty_container}>
          {favorits.length === 0 && (
            <div>
              <p className={styles.empty}>محصولی وجود ندارد</p>
              <p>شما هنوز هیچ محصولی در لیست علاقه مندی های خود ندارید.</p>
              <p>در صفحه "فروشگاه" محصولات جالب زیادی پیدا خواهید کرد.</p>
              <Link href="/category" className={styles.back}>
                بازگشت به فروشگاه
              </Link>
            </div>
          )}
        </div>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              padding: "8px ",
              minWidth: "250px",
              fontSize: "13.5px",
              borderRadius: "5px",
            },
          }}
        />
      </main>
    </>
  );
}
