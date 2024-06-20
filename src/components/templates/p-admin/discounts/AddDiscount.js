"use client";

import React from "react";
import styles from "./discount.module.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddDiscount({ products }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { code: "", percent: "", maxUsage: "", productID: "-1" } });

  const submitDiscount = async (inputData) => {
    const { percent, maxUsage } = inputData;

    if (isNaN(percent) || isNaN(maxUsage)) {
      toast.error("مقدار درصد و حداکثر استفاده باید (عدد) باشد", { id: "wrong-format" });
      return;
    }

    const res = await fetch("/api/discounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...inputData }),
    });

    if (res.status === 201) {
      toast.success("کد تخفیف با موفقیت ثبت شد");
      reset({ code: "", percent: "", maxUsage: "", productID: "-1" });
      router.refresh();
    } else if (res.status === 204) {
      return toast.error("لطفا داده ها را وارد کنید ", { id: "data-empty" });
    } else if (res.status === 422) {
      return toast.error("فیلد های حداکثر استفاده و تعداد دفعات استفاده باید عدد باشند", {
        id: "wrong-data",
      });
    } else if (res.status === 401) {
      return toast.error(" شما به این صفحه دسترسی ندارید ", { id: "not-authorize" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(submitDiscount)} className={styles.discount}>
        <p>افزودن کد تخفیف جدید</p>
        <div className={styles.discount_main}>
          <div>
            <label>شناسه تخفیف</label>
            <input
              {...register("code", { required: " * کد تخفیف را وارد کنید" })}
              placeholder="* لطفا شناسه تخفیف را وارد کنید"
              autoComplete="off"
              type="text"
            />
            <small className={styles.form_alert}>{errors?.code?.message} </small>
          </div>
          <div>
            <label>درصد تخفیف</label>
            <input
              {...register("percent", { required: " * درصد تخفیف را وارد کنید" })}
              autoComplete="off"
              placeholder=" * لطفا درصد تخفیف را وارد کنید (عدد)"
              type="text"
            />
            <small className={styles.form_alert}>{errors?.percent?.message} </small>
          </div>
          <div>
            <label>حداکثر استفاده</label>
            <input
              {...register("maxUsage", { required: " * حداکثر استفاده را وارد کنید" })}
              autoComplete="off"
              placeholder="* حداکثر استفاده از کد تخفیف (عدد)"
              type="text"
            />
            <small className={styles.form_alert}>{errors?.maxUsage?.message} </small>
          </div>
          <div>
            <label>محصول</label>
            <select name="" {...register("productID")}>
              <option value="-1"> یک محصول را انتخاب کنید</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}{" "}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit">افزودن</button>
      </form>
    </div>
  );
}
