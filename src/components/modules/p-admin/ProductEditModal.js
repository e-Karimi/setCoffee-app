"use client";
import React, { useState } from "react";
import styles from "./product-edit-modal.module.css";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductEditModal({ hideModal, productId, setShowEditModal }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [img, setImg] = useState("http://localhost:3000/images/no-image.png");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (res.status === 200) {
        const data = await res.json();
        const {
          name,
          price,
          shortDescription,
          longDescription,
          weight,
          smell,
          suitableFor,
          score,
          tags,
          stock,
          img,
        } = data.product;

        setImg(img);

        const stringTags = tags.join("،");

        return {
          name,
          price,
          shortDescription,
          longDescription,
          weight,
          smell,
          suitableFor,
          score,
          stock,
          tags: stringTags,
        };
      }
    },
  });

  const updateProduct = async (inputData) => {
    const { name, price, shortDescription, longDescription, weight, smell, suitableFor, tags, stock } =
      inputData;

    const tagsArray = tags.split("،");

    if (isNaN(weight) || isNaN(price) || isNaN(stock)) {
      return toast.error("برای فیلد وزن و قیمت و موجودی کالا فقط عدد وارد کنید");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    formData.append("shortDescription", shortDescription);
    formData.append("longDescription", longDescription);
    formData.append("weight", Number(weight));
    formData.append("smell", smell);
    formData.append("suitableFor", suitableFor);
    formData.append("img", img);
    formData.append("tags", tagsArray);

    setSubmitting(true);

    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      body: formData,
    });

    setTimeout(() => setSubmitting(false), 1000);

    if (res.status === 200) {
      setTimeout(() => {
        setShowEditModal(false);
        router.refresh();
      }, 2000);
      toast.success("اطلاعات محصول با موفقیت آپدیت شد");
    } else if (res.status === 422) {
      toast.error("برای فیلد وزن و قیمت فقط عدد وارد کنید");
    }
  };

  return (
    <div className={styles.modal}>
      <div onClick={hideModal} className={styles.modal_overlay}></div>
      <div className={styles.modal_main}>
        <div className={styles.modal_header}>
          <h3>آپدیت اطلاعات </h3>
          <IoClose onClick={hideModal} />
        </div>
        <form onSubmit={handleSubmit(updateProduct)} className={styles.details}>
          <div className={styles.details_main}>
            <section>
              <div>
                <label>نام </label>
                <input
                  {...register("name", { required: " * نام را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                />
                {<small className={styles.form_alert}>{errors?.name?.message} </small>}
              </div>
              <div>
                <label>قیمت</label>
                <input
                  {...register("price", { required: " * قیمت را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                />
                {<small className={styles.form_alert}>{errors?.price?.message} </small>}
              </div>
              <div>
                <label>وزن</label>
                <input
                  {...register("weight", { required: " * وزن را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                />
                {<small className={styles.form_alert}>{errors?.weight?.message} </small>}
              </div>
              <div>
                <label>بو</label>
                <input
                  {...register("smell", { required: " * بو را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                />
                {<small className={styles.form_alert}>{errors?.smell?.message} </small>}
              </div>
              <div>
                <label>کاربرد</label>
                <input
                  {...register("suitableFor", { required: " * کاربرد را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                />
                {<small className={styles.form_alert}>{errors?.suitableFor?.message} </small>}
              </div>
              <div>
                <label>موجودی</label>
                <input
                  {...register("stock", { required: " * موجودی را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                />
                {<small className={styles.form_alert}>{errors?.stock?.message} </small>}
              </div>
              <div style={{ marginTop: "10px" }}>
                <label>توضیحات (خلاصه)</label>
                <textarea
                  {...register("shortDescription", { required: " * توضیحات را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                  className={styles.summary_desc}
                  maxLength={320}
                ></textarea>
                {<small className={styles.form_alert}>{errors?.shortDescription?.message} </small>}
              </div>
              <div style={{ marginTop: "10px" }}>
                <label>توضیحات (کامل)</label>
                <textarea
                  {...register("longDescription", { required: " * توضیحات را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                  className={styles.full_desc}
                ></textarea>
                {<small className={styles.form_alert}>{errors?.longDescription?.message} </small>}
              </div>
              <div style={{ marginTop: "10px" }}>
                <label>تگ ها</label>
                <div>
                  {" "}
                  <small>برای افزودن تگ جدید ، اسامی را با علامت (،) جداکنید.</small>
                </div>
                <textarea
                  {...register("tags", { required: " *تگ ها را وارد کنید" })}
                  autoComplete="off"
                  type="text"
                  className={styles.summary_desc}
                ></textarea>
                {<small className={styles.form_alert}>{errors?.tags?.message} </small>}
              </div>
            </section>
          </div>
          <div className={styles.image_field}>
            <label>تصویر محصول</label>
            <div className={styles.product_image}>
              <input onChange={(e) => setImg(e.target.files[0])} type="file" />
              <div>
                <img src={img} width={150} height={150} />
              </div>
            </div>
          </div>
          <button type="submit" className={styles.submit_btn}>
            {isSubmitting ? "در حال اعمال تغییرات" : "ثبت تغییرات"}
          </button>
        </form>
      </div>
    </div>
  );
}
