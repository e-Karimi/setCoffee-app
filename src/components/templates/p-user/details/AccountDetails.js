"use client";
import React, { useState } from "react";
import styles from "@/styles/p-user/accountDetails.module.css";
import swal from "sweetalert";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import { phonePattern, emailPattern } from "@/utils/auth";
import toast from "react-hot-toast";

function AccountDetails() {
  const [isSubmitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch("/api/auth/me");

      if (res.status === 200) {
        const data = await res.json();
        return { name: data.name, phone: data.phone, email: data.email };
      }
    },
  });

  const updateUser = async (inputData) => {
    setSubmitting(true);

    const res = await fetch("/api/user/edit-account", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...inputData }),
    });

    setSubmitting(false);

    if (res.status === 200) {
      swal({
        title: "اطلاعات مورد نظر با موفقیت آپدیت شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(async (result) => {
        await fetch("/api/auth/signout", { method: "POST" });
        location.replace("/login-register");
      });
    } else if (res.status === 204) {
      return toast.error("لطفا داده ها را وارد کنید ", { id: "data-empty" });
    } else if (res.status === 401) {
      return toast.error("لطفا ابتدا وارد سایت شوید ", { id: "not-login" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit(updateUser)} className={styles.details}>
        <h1 className={styles.title}>
          <span> جزئیات اکانت</span>
        </h1>
        <div className={styles.details_main}>
          <section>
            <div>
              <label>نام کاربری</label>
              <input
                {...register("name", { required: " * نام را وارد کنید" })}
                autoComplete="off"
                type="text"
              />
              {<small className={styles.form_alert}>{errors?.name?.message} </small>}
            </div>
            <div>
              <label>ایمیل</label>
              <input
                {...register("email", {
                  pattern: {
                    value: emailPattern,
                    message: " * ایمیل وارده معتبر نمی باشد",
                  },
                })}
                autoComplete="off"
                type="email"
              />
              {<small className={styles.form_alert}>{errors?.email?.message} </small>}
            </div>
            <div>
              <label>شماره تماس</label>
              <input
                {...register("phone", {
                  required: "* تلفن را وارد کنید",
                  pattern: {
                    value: phonePattern,
                    message: " *شماره تماس وارده معتبر نمی باشد",
                  },
                })}
                type="number"
              />
              <small className={styles.form_alert}>{errors?.phone?.message} </small>
            </div>
          </section>
          <section>
            <div className={styles.uploader}>
              <img src="/images/one.png" alt="" />
              <div>
                <div>
                  <button>
                    <IoCloudUploadOutline />
                    تغییر
                  </button>
                  <input type="file" name="" id="" />
                </div>
                <button>
                  <MdOutlineDelete />
                  حذف
                </button>
              </div>
            </div>
            <div>
              <label>رمز عبور</label>
              <div className={styles.password_group}>
                <input
                  type="password"
                  // {...register("password", {
                  //   pattern: {
                  //     value: passwordPattern,
                  //     message: " *پسورد وارده معتبر نمی باشد",
                  //   },
                  // })}
                  className={styles.input}
                  autoComplete="off"
                  dir="ltr"
                />
                <button>تغییر رمز عبور</button>
              </div>
            </div>
          </section>
        </div>
        <button type="submit" className={styles.submit_btn}>
          {isSubmitting ? "در حال اعمال تغییرات" : "ثبت تغییرات"}
        </button>
      </form>
    </main>
  );
}

export default AccountDetails;
