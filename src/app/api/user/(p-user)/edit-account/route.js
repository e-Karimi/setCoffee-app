import UserModel from "@/models/User";
import connectedToDB from "@/data/db";
import { validatePhone, validateEmail } from "@/utils/auth";
import { authUser } from "@/utils/serverActions";

export async function PATCH(req) {
  try {
    connectedToDB();

    const body = await req.json();

    const { name, email, phone } = body;

    const user = await authUser();

    if (!name.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    if (!validatePhone(phone) || !validateEmail(email)) {
      return Response.json({ message: "data is not correct" }, { status: 422 });
    }

    if (!user) {
      return Response.json({ message: "You are not login" }, { status: 401 });
    }

    await UserModel.findOneAndUpdate({ _id: user._id }, { $set: { name, email, phone } });

    return Response.json({ message: "User data updated successfully" }, { status: 200 });
  } catch (error) {
    console.log("PATCH ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
