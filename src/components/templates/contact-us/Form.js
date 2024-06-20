"use client";

import styles from "./form.module.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { phonePattern, emailPattern } from "@/utils/auth";

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", phone: "", email: "", message: "", company: "" } });

  const submitMessage = async (inputData) => {
    const res = await fetch("/api/contact-us", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...inputData }),
    });

    if (res.status === 201) {
      toast.success("پیغام شما با موفقیت ثبت گرید", { id: "send-message" });
      return reset({ name: "", phone: "", email: "", message: "", company: "" });
    } else if (res.status === 204) {
      return toast.error("لطفا داده ها را وارد کنید ", { id: "data-empty" });
    } else if (res.status === 401) {
      return toast.error("لطفا ابتدا وارد سایت شوید", { id: "not-loggined" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitMessage)} className={styles.form}>
      <span>فرم تماس با ما</span>
      <p>برای تماس با ما می توانید فرم زیر را تکمیل کنید</p>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>نام و نام خانوادگی</label>
          <input {...register("name", { required: " * نام را وارد کنید" })} type="text" autoComplete="off" />
          <small className={styles.form_alert}>{errors?.name?.message} </small>
        </div>
        <div className={styles.group}>
          <label>آدرس ایمیل</label>
          <input
            {...register("email", {
              required: " * ایمیل را وارد کنید",
              pattern: {
                value: emailPattern,
                message: " * ایمیل وارده معتبر نمی باشد",
              },
            })}
            type="text"
          />
          <small className={styles.form_alert}>{errors?.email?.message} </small>
        </div>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label>شماره تماس</label>
          <input
            {...register("phone", {
              required: "* تلفن را وارد کنید",
              pattern: {
                value: phonePattern,
                message: " *شماره تماس وارده معتبر نمی باشد",
              },
            })}
            type="text"
            autoComplete="off"
          />
          <small className={styles.form_alert}>{errors?.phone?.message} </small>
        </div>
        <div className={styles.group}>
          <label>نام شرکت</label>
          <input {...register("company")} type="text" placeholder=" (دلخواه)" />
        </div>
      </div>
      <div className={styles.group}>
        <label>درخواست شما</label>
        <textarea
          {...register("message", { required: " * پیغام خود را وارد کنید" })}
          name="message"
          id="message"
          cols="30"
          rows="3"
        ></textarea>
        <small className={styles.form_alert}>{errors?.message?.message} </small>
      </div>
      <button type="submit">ارسال</button>
    </form>
  );
}
