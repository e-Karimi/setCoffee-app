import Link from "next/link";
import styles from "./latest.module.css";
import { FaChevronLeft } from "react-icons/fa6";
import Product from "@/modules/product/Product";
import connectedToDB from "@/data/db";
import ProductModel from "@/models/Product";

const Latest = async () => {
  connectedToDB();

  const products = await ProductModel.find({}).sort({ _id: -1 }).limit(8);

  return (
    <div className={styles.container}>
      <section className={styles.title}>
        <div>
          <p>آخرین محصولات</p>
        </div>
        <Link className={styles.link} href={"/category"}>
          مشاهده همه <FaChevronLeft />{" "}
        </Link>
      </section>
      <main data-aos="fade-up" className={styles.products}>
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </main>
    </div>
  );
};

export default Latest;
