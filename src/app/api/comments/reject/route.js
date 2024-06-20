import connectedToDB from "@/data/db";
import CommentModel from "@/models/Comment";
import { isValidObjectId } from "mongoose";
import { authAdmin } from "@/utils/serverActions";

//todo => rejecting a comment
export async function PATCH(req) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const reqbody = await req.json();

    const { isAccepted, commentID } = reqbody;

    if (!isValidObjectId(commentID)) {
      return Response.json({ message: "Id is not valid" }, { status: 404 });
    }

    await CommentModel.findOneAndUpdate({ _id: commentID }, { isAccepted });

    return Response.json({ message: "کامنت با موفقیت لغو شد" }, { status: 200 });
  } catch (error) {
    console.log("PATCH ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
