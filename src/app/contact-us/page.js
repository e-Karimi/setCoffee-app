import Breadcrumb from "@/modules/breadcrumb/Breadcrumb";
import Footer from "@/modules/footer/Footer";
import Navbar from "@/modules/navbar/Navbar";
import Form from "@/templates/contact-us/Form";
import Information from "@/templates/contact-us/Information";
import styles from "@/styles/contact-us.module.css";
import { authUser } from "@/utils/serverActions";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("@/templates/contact-us/Map"), { ssr: false });

export default async function contactUsPage() {
  const user = await authUser();

  return (
    <>
      <Navbar isLogined={user ? true : false} />
      <Breadcrumb route={"تماس با ما"} />

      <div className={styles.container}>
        <main className={styles.maps}>
          <section>
            <DynamicMap
              position={[35.72021225108499, 51.42222691580869]}
              center={[35.72021225108499, 51.42222691580869]}
            >
              <span> فروشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه جم)</h3>
              <p>تهران – خ کریمخان زند – خ قائم مقام فراهانی – ابتدای خ فجر(جم) – شماره ۱۰</p>
              <p>021-88305827</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </DynamicMap>
          </section>
          <section>
            <DynamicMap
              position={[35.70153474690238, 51.41497422314844]}
              center={[35.70153474690238, 51.41497422314844]}
            >
              <span> روشگاه ما</span>
              <h3>آدرس فروشگاه حضوری قهوه ست (شعبه انقلاب)</h3>
              <p>تهران - خ انقلاب بین میدان فردوسی و چهار راه کالج روبروی خ ویلا شماره ۸۵۲</p>
              <p>021-66726563</p>
              <Link href="/about-us">درباره فروشگاه</Link>
            </DynamicMap>
          </section>
        </main>
      </div>

      <div className={styles.container}>
        <div className={styles.contents}>
          <Form />
          <Information />
        </div>
      </div>

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            padding: "8px ",
            minWidth: "250px",
            fontSize: "13.5px",
            borderRadius: "5px",
          },
        }}
      />
    </>
  );
}
