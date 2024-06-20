import styles from "@/styles/product.module.css";

import Gallery from "@/templates/product/Gallery";
import Details from "@/components/templates/product/details/Details";
import Tabs from "@/components/templates/product/tabs/Tabs";
import MoreProducts from "@/templates/product/MoreProducts";

import ProductModel from "@/models/Product";
import CommentModel from "@/models/Comment";
import connectedToDB from "@/data/db";

import Footer from "@/modules/footer/Footer";
import Navbar from "@/modules/navbar/Navbar";
import { authUser } from "@/utils/serverActions";
import { Toaster } from "react-hot-toast";

const ProductPage = async ({ params }) => {
  connectedToDB();

  const user = await authUser();

  const product = await ProductModel.findOne({ _id: params.id }).populate("comments").lean();

  const acceptedComments = await CommentModel.find({ productID: product._id, isAccepted: true });

  const relatedProducts = await ProductModel.find({ smell: product.smell });

  return (
    <div className={styles.container}>
      <Navbar isLogined={user ? true : false} />
      <div data-aos="fade-up" className={styles.contents}>
        <div className={styles.main}>
          <Details
            product={JSON.parse(JSON.stringify(product))}
            acceptedComments={JSON.parse(JSON.stringify(acceptedComments))}
          />
          <Gallery images={product?.img} />
        </div>
        <Tabs
          product={JSON.parse(JSON.stringify(product))}
          acceptedComments={JSON.parse(JSON.stringify(acceptedComments))}
        />
        <MoreProducts relatedProducts={JSON.parse(JSON.stringify(relatedProducts))} />
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
    </div>
  );
};

export default ProductPage;
