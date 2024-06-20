import TicketModel from "@/models/Ticket";
import connectedToDB from "@/data/db";
import { authUser } from "@/utils/serverActions";


export async function POST(req) {
  try {
    connectedToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "You are not login" }, { status: 401 });
    }

    const reqbody = await req.json();

    const { title, body, department, subDepartment, priority } = reqbody;

    if (!title.trim() || !body.trim() || !department.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 422 });
    }

    const hasSubDepartment = "subDepartment" in reqbody;

    if (hasSubDepartment) {
      await TicketModel.create({
        title,
        body,
        department,
        subDepartment,
        priority,
        user: user._id,
        isAnswer: false,
        hasAnswer: false,
      });
    } else {
      await TicketModel.create({
        title,
        body,
        department,
        priority,
        user: user._id,
        isAnswer: false,
        hasAnswer: false,
      });
    }

    return Response.json({ message: "Ticket added successfully" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
