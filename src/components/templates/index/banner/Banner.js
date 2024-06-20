"use client";

import React from "react";
import Image from "next/image";
import slide1 from "/public/images/slide1.jpg";
import slide2 from "/public/images/slide2.jpg";
import slide3 from "/public/images/slide3.jpg";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation, Autoplay } from "swiper/modules";

export default function Banner() {
  return (
    <Swiper
      navigation={true}
      modules={[Navigation, Autoplay]}
      loop={true}
      autoplay={{ delay: 1500 }}
      className="mySwiper home-slider"
    >
      <SwiperSlide>
        <Image src={slide1} alt="Slide" priority={true} />
      </SwiperSlide>
      <SwiperSlide>
        <Image src={slide2} alt="Slide" />
      </SwiperSlide>
      <SwiperSlide>
        <Image src={slide3} alt="Slide" />
      </SwiperSlide>
    </Swiper>
  );
}
