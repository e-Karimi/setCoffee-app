import React, { useState, useRef } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Sms from "@/templates/login-register/Sms";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Login = ({ showRegisterForm }) => {
  const router = useRouter();
  const [isLoginWithOtp, setIsLoginWithOtp] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [password, setPassword] = useState("");
  const [identifire, setIdentifire] = useState("");
  const timeRef = useRef();

  const showOtpForm = () => setIsLoginWithOtp(true);
  const hideOtpForm = () => setIsLoginWithOtp(false);

  //todo => login with password and (email or phone)
  const signInWithPassword = async () => {
    if (!identifire) {
      return toast.error("لطفا شماره تماس یا ایمیل را وارد کنید");
    }

    if (!validatePhone(identifire) && !validateEmail(identifire)) {
      return toast.error("ایمیل یا شماره تلفن وارد شده صحیح نیست");
    }

    if (!password) {
      return toast.error("پسورد را وارد کنید");
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return toast.error("پسورد به اندازه کافی قوی نیست");
    }

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifire, password }),
    });

  
    if (res.status === 200) {
      setPassword("");
      setIdentifire("");
      router.push("/p-user");
      router.refresh();
      toast.success("با موفقیت  وارد شدید", { id: "login-success" });
      return;
    } else if (res.status === 404) {
      return toast.error(" حساب کاربری موجود نمی باشد", { id: "already-exist" });
    } else if (res.status === 401) {
      return toast.error(" پسورد یا ایمیل  صحیح نمی باشد", { id: "data-invalid" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "server-problem" });
    }
  };

  //todo => login with Otp
  const sendOtp = async () => {
    if (!identifire.trim()) {
      return toast.error("لطفا شماره موبایل خود را وارد کنید");
    }

    const isValidPhone = validatePhone(identifire);
    if (!isValidPhone) {
      return toast.error("شماره تماس وارد شده معتبر نیست", { id: "phone-wrong" });
    }

    timeRef.current = timeRef.current + 1;

    if (timeRef.current > 3) {
      toast.error("شما بیش از میزان مجاز درخواست ارسال کد داشتید. لطفا 5 دقیقه دیگه دوباره امتحان کنید؟", {
        id: "TOO_MANY_ATTEMPTS",
      });

      setTimeout(() => (timeRef.current = 0), 50000);
      return;
    }

    const res = await fetch("/api/auth/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: identifire, times: timeRef.current, isSignIn: true }),
    });

    if (res.status === 201) {
      swal({
        text: "کد ورود با موفقیت Sms شد",
        icon: "success",
        buttons: "وارد کردن کد لاگین",
      }).then(() => {
        showOtpForm();
      });
    } else if (res.status === 429) {
      toast.error("شما بیش از میزان مجاز درخواست ارسال کد داشتید. لطفا 5 دقیقه دیگه دوباره امتحان کنید؟", {
        id: "Many-Requests",
      });
    } else if (res.status === 403) {
      return toast.error(" این   شماره تلفن  مسدود می باشد ", { id: "baned-user" });
    } else if (res.status === 400) {
      return toast.error("درخواست ناموفق بود", { id: "Bad-Request" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  return (
    <>
      {isLoginWithOtp ? (
        <Sms hideOtpForm={hideOtpForm} sendOtp={sendOtp} phone={identifire} isSignIn={true} />
      ) : (
        <>
          <div className={styles.login_form}>
            <input
              className={styles.identifire_field}
              type="text"
              value={identifire}
              onChange={(event) => setIdentifire(event.target.value)}
              placeholder="ایمیل/شماره موبایل"
            />
            <div className={styles.password_field}>
              <input
                className={styles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="رمز عبور"
                type={isSeen ? "text" : "password"}
              />
              <span className={styles.eye} onClick={() => setIsSeen((prev) => !prev)}>
                {isSeen ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>

            <div className={styles.checkbox}>
              <input type="checkbox" name="" id="" />
              <p>مرا به یاد داشته باش</p>
            </div>
            <button type="submit" onClick={signInWithPassword} className={styles.btn}>
              ورود با رمز عبور
            </button>
            <Link href={"/forget-password"} className={styles.forgot_pass}>
              رمز عبور را فراموش کرده اید؟
            </Link>
            <button onClick={sendOtp} className={styles.btn}>
              ورود با کد یکبار مصرف
            </button>
            <span className={styles.question}>آیا حساب کاربری ندارید؟</span>
            <button className={styles.btn_light} onClick={showRegisterForm}>
              ثبت نام
            </button>
          </div>
          <Link href="/" className={styles.redirect_to_home}>
            لغو
          </Link>
        </>
      )}
    </>
  );
};

export default Login;
