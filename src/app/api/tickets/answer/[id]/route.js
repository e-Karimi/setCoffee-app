import TicketModel from "@/models/Ticket";
import connectedToDB from "@/data/db";
import { isValidObjectId } from "mongoose";
import { authAdmin } from "@/utils/serverActions";

export async function POST(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      return Response.json({ message: "You are not allowed to access this section" }, { status: 401 });
      // throw new Error("This API has been protected and you can NOT access this route");
    }

    const questionTicketId = params.id;

    const reqbody = await req.json();

    const { title, body, department, subDepartment, priority } = reqbody;

    if (!title.trim() || !body.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 422 });
    }

    if (!isValidObjectId(department)) {
      return Response.json({ message: "department Id is not valid" }, { status: 422 });
    }

    const hasSubDepartment = "subDepartment" in reqbody;

    //Create an answer ticket
    if (hasSubDepartment) {
      await TicketModel.create({
        title,
        body,
        department,
        subDepartment,
        priority,
        user: user._id,
        isAnswer: true,
        answerTo: questionTicketId,
      });
    } else {
      await TicketModel.create({
        title,
        body,
        department,
        priority,
        user: user._id,
        isAnswer: true,
        answerTo: questionTicketId,
      });
    }

    //To determine the question ticket is answered
    await TicketModel.findOneAndUpdate({ _id: questionTicketId }, { $set: { hasAnswer: true } });

    return Response.json({ message: "Ticket was answered successfully" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
