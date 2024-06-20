import UserModel from "@/models/User";
import { isValidObjectId } from "mongoose";
import { roles } from "@/utils/constants";
import connectedToDB from "@/data/db";
import { authAdmin } from "@/utils/serverActions";

//todo => changing user's role
export async function PATCH(req) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const body = await req.json();
    const { userID } = body;

    if (!isValidObjectId(userID)) {
      return Response.json({ message: "User ID is not valid" }, { status: 422 });
    }

    const user = await UserModel.findOne({ _id: userID });

    const newRole = user.role === roles.USER ? roles.ADMIN : roles.USER;

    await UserModel.findOneAndUpdate({ _id: userID }, { $set: { role: newRole } });

    return Response.json({ message: "User role updated successfully" }, { status: 200 });
  } catch (error) {
    console.log("PATCH ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
