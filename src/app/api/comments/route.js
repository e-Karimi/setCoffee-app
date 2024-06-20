import connectedToDB from "@/data/db";
import CommentModel from "@/models/Comment";
import { validateEmail } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { authUser } from "@/utils/serverActions";

//todo => Create a comment
export async function POST(req) {
  try {
    connectedToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "You are not login" }, { status: 401 });
    }

    const reqbody = await req.json();

    const { username, email, body, score, productID, date } = reqbody;

    //*Valiidations
    if ((!username.trim(), !body.trim(), !score.toString().trim())) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    if (!isValidObjectId(productID)) {
      return Response.json({ message: "Id is not valid" }, { status: 404 });
    }

    if (!validateEmail(email)) {
      return Response.json({ message: "Email is not valid" }, { status: 401 });
    }

    const comment = await CommentModel.create({
      username,
      email,
      body,
      score,
      productID,
      userID: user._id,
      date,
    });

    return Response.json({ message: "Comment created successfully", data: comment }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

//todo => Get all comments
export async function GET() {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const comments = await CommentModel.find({}, "-__v").populate("productID").populate("userID").lean();

    return Response.json({ data: comments }, { status: 200 });
  } catch (error) {
    console.log("GET ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
