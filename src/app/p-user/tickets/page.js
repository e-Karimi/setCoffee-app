import Tickets from "@/templates/p-user/tickets/Tickets";
import connectToDB from "@/data/db";
import { authUser } from "@/utils/serverActions";
import TicketModel from "@/models/Ticket";

export default async function ticketsPage() {
  connectToDB();

  const user = await authUser();

  const userTickets = await TicketModel.find({ user: user._id })
    .sort({ _id: -1 })
    .populate("department", "name")
    .lean();
  console.log("ticketsPage ~ userTickets:", userTickets);

  return <Tickets tickets={JSON.parse(JSON.stringify(userTickets))} />;
}
