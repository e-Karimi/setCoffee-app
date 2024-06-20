"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

//* Text content does not match server-rendered HTML => solution: Disabling SSR on Product component
import dynamic from "next/dynamic";
const NoSSRProduct = dynamic(() => import("@/modules/product/Product"), { ssr: false });

const MoreProducts = ({ relatedProducts }) => {
  return (
    <div data-aos="fade-right">
      <section>
        <h2>محصولات مرتبط</h2>
        <div
          style={{
            height: "2px",
            width: "70px",
            background: "black",
            marginTop: "10px",
          }}
        ></div>
      </section>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        dir="rtl"
        rewind={true}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper "
      >
        {relatedProducts.length > 0 &&
          relatedProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <NoSSRProduct product={JSON.parse(JSON.stringify(product))} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default MoreProducts;
