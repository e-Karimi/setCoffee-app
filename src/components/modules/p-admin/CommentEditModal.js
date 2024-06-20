import { IoClose } from "react-icons/io5";
import styles from "./comment-edit-modal.module.css";
import { useForm } from "react-hook-form";

const CommentEditModal = ({ hideModal, title, commentId, updateContent, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`/api/comments/${commentId}`);
      if (res.status === 200) {
        const data = await res.json();
        return { body: data.comment.body };
      }
    },
  });

  return (
    <div className={styles.modal}>
      <div onClick={hideModal} className={styles.modal_overlay}></div>
      <div className={styles.modal_main}>
        <div className={styles.modal_header}>
          <span style={{ color: "brown" }}>{title}</span>
          <IoClose onClick={hideModal} />
        </div>
        <form onSubmit={handleSubmit((data) => updateContent(data, commentId))} className={styles.details}>
          <div className={styles.details_main}>
            <section>
              <div>
                <div>
                  <textarea
                    {...register("body", { required: " * متن را وارد کنید" })}
                    cols={60}
                    rows={10}
                    className={styles.text_demo}
                    autoComplete="off"
                  />
                </div>
                {<small className={styles.form_alert}> {errors?.body?.message} </small>}
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

export default CommentEditModal;
