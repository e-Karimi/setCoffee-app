import { IoClose } from "react-icons/io5";
import styles from "./user-edit-modal.module.css";
import { useForm } from "react-hook-form";
import { phonePattern, emailPattern } from "@/utils/auth";

const UserEditModal = ({ hideModal, title, userId, updateUser, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`/api/user/${userId}`);
      if (res.status === 200) {
        const data = await res.json();
        return { name: data.name, phone: data.phone, email: data.email };
      }
    },
  });

  return (
    <div className={styles.modal}>
      <div onClick={hideModal} className={styles.modal_overlay}></div>
      <div className={styles.modal_main}>
        <div className={styles.modal_header}>
          <span>{title}</span>
          <IoClose onClick={hideModal} />
        </div>
        <form onSubmit={handleSubmit(updateUser)} className={styles.details}>
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
                    required: " * ایمیل را وارد کنید",
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
          </div>
          <button type="submit" className={styles.submit_btn}>
            {isSubmitting ? "در حال اعمال تغییرات" : "ثبت تغییرات"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
