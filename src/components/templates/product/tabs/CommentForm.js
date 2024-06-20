import { useState } from "react";
import { IoMdStar } from "react-icons/io";
import styles from "./commentForm.module.css";
import { useForm } from "react-hook-form";
import { emailPattern } from "@/utils/auth";
import toast from "react-hot-toast";

export default function CommentForm({ productID }) {
  const [score, setScore] = useState(5);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      let userData = JSON.parse(localStorage.getItem("user")) || {};
      return {
        username: userData?.username || "",
        email: userData?.email || "",
        body: "",
        saveUserInfo: true,
      };
    },
  });

  const handleCommentScore = (grade) => {
    setScore(grade);
    toast.success("امتیاز شما ثبت گردید", { id: "set-comment-score" });
  };

  const submitComment = async (data) => {
    if (data.saveUserInfo) {
      let userData = JSON.parse(localStorage.getItem("user")) || {};
      userData = { username: data.username, email: data.email };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    const newComment = { ...data, score, productID };

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newComment }),
    });

    if (res.status === 201) {
      reset({ username: "", email: "", body: "", saveUserInfo: true });

      toast.success("دیدگاه شما با موفقیت ثبت گردید و بعد از تایید نمایش داده می شود", {
        id: "submit-comment",
      });
      return;
    } else if (res.status === 404) {
      return toast.error(" لطفا ابتدا لاگین کنید", { id: "user-not-login" });
    } else if (res.status === 401) {
      return toast.error("   ایمیل  صحیح نمی باشد", { id: "email-invalid" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "server-problems" });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitComment)} className={styles.form}>
      <p className={styles.title}>دیدگاه خود را بنویسید</p>
      <p>
        نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری شده‌اند{" "}
        <span style={{ color: "red" }}>*</span>
      </p>
      <div className={styles.rate}>
        <p>امتیاز شما :</p>
        <div>
          <IoMdStar onClick={() => handleCommentScore(5)} />
          <IoMdStar onClick={() => handleCommentScore(4)} />
          <IoMdStar onClick={() => handleCommentScore(3)} />
          <IoMdStar onClick={() => handleCommentScore(2)} />
          <IoMdStar onClick={() => handleCommentScore(1)} />
        </div>
      </div>
      <div className={styles.group}>
        <label htmlFor="">
          دیدگاه شما
          <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          {...register("body", { required: "  دیدگاه خود را وارد کنید" })}
          id="body"
          name="body"
          cols="45"
          rows="8"
        ></textarea>
        <small className={styles.form_alert}>{errors?.body?.message} </small>
      </div>
      <div className={styles.groups}>
        <div className={styles.group}>
          <label htmlFor="">
            نام
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            {...register("username", { required: "  نام خود را وارد کنید" })}
            autoComplete="off"
          />
          <small className={styles.form_alert}>{errors?.username?.message} </small>
        </div>
        <div className={styles.group}>
          <label htmlFor="">
            ایمیل
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            autoComplete="off"
            {...register("email", {
              required: "  ایمیل خود را وارد کنید",
              pattern: {
                value: emailPattern,
                message: "  ایمیل وارده معتبر نمی باشد",
              },
            })}
          />
          <small className={styles.form_alert}>{errors?.email?.message} </small>
        </div>
      </div>
      <div className={styles.checkbox}>
        <input {...register("saveUserInfo")} type="checkbox" name="" id="" />
        <p> ذخیره نام، ایمیل و وبسایت من در مرورگر برای زمانی که دوباره دیدگاهی می‌نویسم.</p>
      </div>
      <button>ثبت</button>
    </form>
  );
}
