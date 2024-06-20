"use client";

import React, { useState, useEffect } from "react";
import Login from "@/templates/login-register/Login";
import Register from "@/templates/login-register/Register";
import { authTypes } from "@/utils/constants";
import styles from "@/styles/login-register.module.css";
import { Toaster } from "react-hot-toast";
import { authUser } from "@/utils/serverActions";
import { useRouter } from "next/navigation";

export default function LoginRegisterPage() {
  const [authType, setAuthType] = useState(authTypes.LOGIN);
  const router = useRouter();

  //* Protect the /login-register path when user is loggin
  useEffect(() => {
    const authHandler = async () => {
      const user = await authUser();
      if (user) {
        router.replace("/p-user/account-details");
        return;
      }
    };
    authHandler();
  }, []);

  const showRegisterForm = () => setAuthType(authTypes.REGISTER);
  const showloginForm = () => setAuthType(authTypes.LOGIN);

  return (
    <div className={styles.login_register}>
      <div className={styles.form_bg} data-aos="fade-up">
        {authType === authTypes.LOGIN ? (
          <Login showRegisterForm={showRegisterForm} />
        ) : (
          <Register showloginForm={showloginForm} />
        )}
      </div>
      <section>
        <img
          src="https://neurosciencenews.com/files/2023/06/coffee-brain-caffeine-neuroscincces.jpg"
          alt=""
        />
      </section>
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
}
