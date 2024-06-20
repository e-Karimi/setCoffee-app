import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./comment.module.css";

const Comment = ({ comment: { username, body, date, score } }) => {
  return (
    <section className={styles.comment}>
      <img src="/images/one.png" className={styles.avatar} alt="" />
      <div>
        <div className={styles.main_details}>
          <div className={styles.user_info}>
            <strong>{username}</strong>
            <p>{new Date(date).toLocaleDateString("fa-IR")} </p>
          </div>
          <div className={styles.stars}>
            {score > 0 &&
              Array(score)
                .fill(0)
                .map((item, index) => <FaStar key={index + 1} />)}
            {score > 0 &&
              Array(5 - score)
                .fill(0)
                .map((item, index) => <FaRegStar key={index + 1} />)}
          </div>
        </div>
        <p>{body}</p>
      </div>
    </section>
  );
};

export default Comment;
