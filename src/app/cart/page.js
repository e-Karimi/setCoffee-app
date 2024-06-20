import Footer from "@/modules/footer/Footer";
import Navbar from "@/modules/navbar/Navbar";
import Stepper from "@/modules/stepper/Stepper";
import styles from "@/styles/cart.module.css";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";

const DynamicTable = dynamic(() => import("@/templates/cart/Table"), { ssr: false });

export default async function cartPage() {
  return (
    <>
      <Navbar />
      <Stepper step="cart" />
      <main className={styles.cart} data-aos="fade-up">
        <DynamicTable />
      </main>
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
