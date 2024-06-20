"use client";
import { useState, useRef } from "react";
import styles from "./register.module.css";
import Sms from "@/templates/login-register/Sms";
import toast from "react-hot-toast";
import { validateEmail, validatePassword, validatePhone } from "@/utils/auth";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

const Register = ({ showloginForm }) => {
  const [isRegisterWithPass, setIsRegisterWithPass] = useState(false);
  const [isRegisterWithOtp, setIsRegisterWithOtp] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSeen, setIsSeen] = useState(false);
  const router = useRouter();
  const timeRef = useRef(0);

  const hideOtpForm = () => setIsRegisterWithOtp(false);
  const showOtpForm = () => {
    setIsRegisterWithOtp(true);
    setIsRegisterWithPass(false);
  };

  //todo => sign Up with password and (phone)
  const signUpWithPassword = async () => {
    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return toast.error("شماره تماس وارد شده معتبر نیست", { id: "phone-wrong" });
    }

    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        return toast.error("ایمیل وارد شده معتبر نیست", { id: "email-wrong" });
      }
    }

    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return toast.error("پسورد وارد شده  معتبر نیست", { id: "password-wrong" });
    }

    const user = { name, phone, email, password };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user }),
    });

    if (res.status === 201) {
      toast.success("با موفقیت ثبت نام شدید", { id: "success" });
      router.push("/");
      router.refresh();
      return;
    } else if (res.status === 422) {
      return toast.error("داده ها معتبر نمی باشند", { id: "data-wrong" });
    } else if (res.status === 409) {
      return toast.error(" شما قبلا ثبت نام کرده اید . لطفا لگین کنید", { id: "already-enrolled" });
    } else if (res.status === 403) {
      return toast.error(" این پسورد یا ایمیل  مسدود شده است   ", { id: "data-invalid" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  //todo => sign Up  with Otp
  const sendOtp = async () => {
    const isValidPhone = validatePhone(phone);
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
      body: JSON.stringify({ phone, times: timeRef.current, isSignIn: false }),
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
    } else if (res.status === 409) {
      showloginForm();
      return toast.error(" شما قبلا ثبت نام کرده اید . لطفا لگین کنید", { id: "already-enrolled" });
    } else if (res.status === 400) {
      return toast.error("درخواست ناموفق بود", { id: "Bad-Request" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  return (
    <>
      {isRegisterWithOtp ? (
        <Sms hideOtpForm={hideOtpForm} phone={phone} sendOtp={sendOtp} isSignIn={false} />
      ) : (
        <>
          <div className={styles.form}>
            <input
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="نام (دلخواه)"
            />

            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ایمیل (دلخواه)"
            />
            <input
              className={styles.input}
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="شماره موبایل  (الزامی * )"
            />

            {isRegisterWithPass && (
              <>
                <div className={styles.password_field}>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={styles.input}
                    type={isSeen ? "text" : "password"}
                    placeholder="رمز عبور *"
                    autoComplete="off"
                    dir="ltr"
                  />
                  <span className={styles.eye} onClick={() => setIsSeen((prev) => !prev)}>
                    {isSeen ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </span>
                </div>
                <div className={styles.note}>
                  <small>
                    {" "}
                    پسورد باید شامل یک حرف بزرگ + حداقل یک حرف کوچک + حداقل دو عدد + یک کاراکتر باشد
                  </small>
                  <small> @Name2024</small>
                </div>{" "}
              </>
            )}

            <button
              style={{ marginTop: "1rem" }}
              onClick={() => {
                if (isRegisterWithPass) {
                  signUpWithPassword();
                } else {
                  setIsRegisterWithPass(true);
                }
              }}
              className={styles.btn}
            >
              ثبت نام با رمزعبور
            </button>

            <button type="button" onClick={sendOtp} style={{ marginTop: "1rem" }} className={styles.btn}>
              ثبت نام با کد تایید
            </button>

            <p onClick={showloginForm} className={styles.back_to_login}>
              برگشت به ورود
            </p>
          </div>
          <p onClick={() => router.push("/")} className={styles.redirect_to_home}>
            لغو
          </p>
        </>
      )}
    </>
  );
};

export default Register;
