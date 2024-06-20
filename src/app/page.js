import React from "react";
import Navbar from "@/modules/navbar/Navbar";
import Banner from "@/templates/index/banner/Banner";
import Latest from "@/templates/index/latest/Latest";
import Promote from "@/templates/index/promote/Promote";
import Articles from "@/templates/index/articles/Articles";
import Footer from "@/modules/footer/Footer";
import { authUser } from "@/utils/serverActions";
import connectedToDB from "@/data/db";

export default async function HomePage() {
  connectedToDB();
  const user = await authUser();

  return (
    <>
      <Navbar isLogined={user ? true : false} />
      <Banner />
      <Latest />
      <Promote />
      <Articles />
      <Footer />
    </>
  );
}
