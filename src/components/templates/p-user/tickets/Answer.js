import styles from "./answer.module.css";

const Answer = ({ type, username, createdAt, body }) => {
  return (
    <section className={type == "user" ? styles.userTicket : styles.adminticket}>
      <div className={styles.ticket_main}>
        <p>{new Date(createdAt).toLocaleDateString("fa-IR")} </p>
        <div>
          <div>
            <p> {username}</p>
            <span>{type === "user" ? "کاربر" : "ادمین"}</span>
          </div>
          <img src="/images/one.png" alt="" />
        </div>
      </div>
      <div className={styles.ticket_text}>
        <p> {body}</p>
      </div>
    </section>
  );
};

export default Answer;
