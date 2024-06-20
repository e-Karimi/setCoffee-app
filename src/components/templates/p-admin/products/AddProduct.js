"use client";
import React, { useState } from "react";
import styles from "./table.module.css";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function AddProduct() {
  const [img, setImg] = useState("http://localhost:3000/images/no-image.png");
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      shortDescription: "",
      longDescription: "",
      weight: "",
      stock: "",
      smell: "",
      suitableFor: "",
      tags: "",
    },
  });

  const addProduct = async (inputData) => {
    const { name, price, shortDescription, longDescription, weight, stock, smell, suitableFor, tags } =
    inputData;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", Number(price));
    formData.append("shortDescription", shortDescription);
    formData.append("longDescription", longDescription);
    formData.append("weight", Number(weight));
    formData.append("stock", Number(stock));
    formData.append("smell", smell);
    formData.append("suitableFor", suitableFor);
    formData.append("tags", tags?.split("،"));
    formData.append("img", img);

    const res = await fetch("/api/products", { method: "POST", body: formData });

    if (res.status === 201) {
      swal({
        title: "محصول مورد نظر با موفقیت ایجاد شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        router.refresh();
        reset({
          name: "",
          price: "",
          shortDescription: "",
          longDescription: "",
          weight: "",
          stock: "",
          smell: "",
          suitableFor: "",
          tags: "",
        });
      });
    } else if (res.status === 500) {
      return toast.error("خطای داخلی سرور", { id: "server" });
    }
  };

  return (
    <form onSubmit={handleSubmit(addProduct)} encType="multipart/form-data" className={styles.add_product}>
      <p>افزودن محصول جدید</p>
      <div className={styles.add_product_main}>
        <div>
          <label>نام محصول</label>
          <input
            {...register("name", { required: "لطفا نام محصول را وارد کنید" })}
            placeholder="نام"
            type="text"
            autoComplete="off"
          />
          <small className={styles.form_alert}>{errors?.name?.message}</small>
        </div>
        <div>
          <label>مبلغ محصول</label>
          <input
            {...register("price", { required: "لطفا قیمت محصول را وارد کنید" })}
            placeholder="قیمت"
            type="number"
            autoComplete="off"
          />
          <small className={styles.form_alert}>{errors?.price?.message}</small>
        </div>

        <div>
          <label>وزن</label>
          <input
            {...register("weight", { required: "لطفا وزن محصول را وارد کنید" })}
            placeholder="وزن"
            autoComplete="off"
            type="number"
          />
          <small className={styles.form_alert}>{errors?.weight?.message}</small>
        </div>
        <div>
          <label>مناسب برای:</label>
          <input
            {...register("suitableFor", { required: "لطفا کاربرد محصول را وارد کنید" })}
            placeholder="مناسب برای ..."
            type="text"
            autoComplete="off"
          />
          <small className={styles.form_alert}>{errors?.suitableFor?.message}</small>
        </div>
        <div>
          <label>میزان بو</label>
          <input
            {...register("smell", { required: "لطفا میزان بو محصول را وارد کنید" })}
            placeholder="میزان بو"
            type="text"
            autoComplete="off"
          />
          <small className={styles.form_alert}>{errors?.smell?.message}</small>
        </div>
        <div>
          <label>تصویر محصول</label>
          <input onChange={(e) => setImg(e.target.files[0])} type="file" />
        </div>
        <div>
          <label>توضیحات (خلاصه)</label>
          <textarea
            {...register("shortDescription", { required: "لطفا توضیحات کوتاه محصول را وارد کنید" })}
            className={styles.summary_desc}
            maxLength={320}
            type="text"
          ></textarea>
          <small className={styles.form_alert}>{errors?.shortDescription?.message}</small>
        </div>
        <div>
          <label>تگ های محصول</label>
          <textarea
            {...register("tags", { required: "لطفا تگ های محصول را وارد کنید" })}
            autoComplete="off"
            type="text"
            placeholder="مثال: قهو، قهوه ترک، قهوه اسپرسو"
            className={styles.summary_desc}
          ></textarea>
          <small className={styles.note}>برای افزودن تگ جدید ، اسامی را با علامت (،) جداکنید.</small>
          <small className={styles.form_alert}>{errors?.tags?.message}</small>
        </div>
        <div>
          <label>توضیحات (کامل)</label>
          <textarea
            {...register("longDescription", { required: "لطفا توضیحات بلند محصول را وارد کنید" })}
            autoComplete="off"
            type="text"
            className={styles.full_desc}
          ></textarea>
          <small className={styles.form_alert}>{errors?.longDescription?.message}</small>
        </div>

        <div>
          <label>موجودی</label>
          <input
            {...register("stock", { required: " * موجودی را وارد کنید" })}
            autoComplete="off"
            type="number"
            placeholder="تعداد کالای موجود"
          />
          {<small className={styles.form_alert}>{errors?.stock?.message} </small>}
        </div>
      </div>
      <button onClick={addProduct}>افزودن</button>
    </form>
  );
}
