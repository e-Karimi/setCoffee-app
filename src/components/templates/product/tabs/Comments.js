import Comment from "@/modules/comment/Comment";
import styles from "./comments.module.css";
import CommentForm from "./CommentForm";

const Comments = ({ acceptedComments, productName, productID }) => {
  return (
    <div>
      <p>نظرات ({acceptedComments?.length}) :</p>
      <hr />

      <main className={styles.comments}>
        <div className={styles.user_comments}>
          <p className={styles.title}>
            {acceptedComments?.length} دیدگاه برای {productName}
          </p>
          <div>
            {acceptedComments?.length > 0 &&
              acceptedComments.map((comment) => <Comment key={comment._id} comment={comment} />)}
          </div>
        </div>
        <div className={styles.form_bg}>
          <CommentForm productID={productID} />
        </div>
      </main>
    </div>
  );
};

export default Comments;
