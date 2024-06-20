import Link from "next/link";
import Answer from "@/templates/p-user/tickets/Answer";
import connectToDB from "@/data/db";
import TicketModel from "@/models/Ticket";
import styles from "@/styles/p-user/answer-ticket.module.css";

export default async function AnswerPage({ params }) {
  connectToDB();

  const ticketID = params.id;

  const questionTicket = await TicketModel.findOne({ _id: ticketID }).populate("user", " name ").lean();

  const answerTickets = await TicketModel.find({ answerTo: ticketID }).populate("user", " name ").lean();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        <span>تیکت های {questionTicket.user?.name}</span>
        <Link href="/p-user/tickets/send-ticket">ارسال تیکت جدید</Link>
      </h1>

      <div>
        <Answer type="user" {...questionTicket} username={questionTicket.user.name} />

        {answerTickets.length > 0 ? (
          answerTickets.map((answerTicket) => (
            <Answer key={answerTicket._id} type="admin" {...answerTicket} username={answerTicket.user.name} />
          ))
        ) : (
          <div className={styles.empty}>
            <p>هنوز پاسخی دریافت نکردید</p>
          </div>
        )}
      </div>
    </main>
  );
}
