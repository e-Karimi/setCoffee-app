import connectedToDB from "@/data/db";
import ContactModel from "@/models/Contact";
import { validateEmail, validatePhone } from "@/utils/auth";
import { authUser } from "@/utils/serverActions";

export async function POST(req) {
  try {
    connectedToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "You are not logined" }, { status: 401 });
    }

    const reqbody = await req.json();

    const { name, email, message, phone, company } = reqbody;

    //*Valiidations
    if ((!name.trim(), !message.trim())) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    if (!validateEmail(email)) {
      return Response.json({ message: "Email is not valid" }, { status: 422 });
    }

    if (!validatePhone(phone)) {
      return Response.json({ message: "phone is not valid" }, { status: 422 });
    }

    await ContactModel.create({ name, email, message, phone, company });

    return Response.json({ message: "contact created successfully" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
