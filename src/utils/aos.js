"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInitialize() {
  useEffect(() => {
    AOS.init();
  }, []);
  return null;
}
