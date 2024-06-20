"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./sms.module.css";
import toast from "react-hot-toast";

const Sms = ({ hideOtpForm, phone, sendOtp, isSignIn }) => {
  const router = useRouter();
  const [code, setCode] = useState("");

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.error("لطفا کد را وارد کنید", { id: "empty-data" });
    }

    const res = await fetch("/api/auth/sms/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, phone, isSignIn }),
    });

    if (res.status === 202) {
      swal({
        text: "کد تایید شد",
        icon: "success",
        buttons: " ورود به  پنل کاربری ",
      }).then(() => {
        router.replace("/p-user");
      });
    } else if (res.status === 401) {
      toast.error("کد یا شماره تلفن صحیحی نمی باشد", {
        id: "unauthorized ",
      });
    } else if (res.status === 410) {
      toast.error("زمان استفاده از کد به پایان رسیده است.", {
        id: "code-expired",
      });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  return (
    <>
      <div className={styles.form}>
        <p>کد تایید</p>
        <span className={styles.code_title}>لطفاً کد تأیید ارسال شده را تایپ کنید</span>
        <span className={styles.number}>{phone}</span>
        <input value={code} onChange={(e) => setCode(e.target.value)} className={styles.input} type="text" />
        <button onClick={verifyCode} style={{ marginTop: "1rem" }} className={styles.btn}>
          ثبت کد تایید
        </button>
        <p onClick={sendOtp} className={styles.send_again_code}>
          ارسال مجدد کد یکبار مصرف
        </p>
      </div>
      <p onClick={hideOtpForm} className={styles.redirect_to_home}>
        لغو
      </p>
    </>
  );
};

export default Sms;
