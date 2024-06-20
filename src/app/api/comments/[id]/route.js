import connectedToDB from "@/data/db";
import CommentModel from "@/models/Comment";
import { isValidObjectId } from "mongoose";
import { authUser } from "@/utils/serverActions";
import { authAdmin } from "@/utils/serverActions";

//todo => deleting a comment
export async function DELETE(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const commentID = params.id;

    if (!isValidObjectId(commentID)) {
      return Response.json({ message: "Id is not valid" }, { status: 404 });
    }

    await CommentModel.findOneAndDelete({ _id: commentID });

    return Response.json({ message: "Comment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("DELETE ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

//todo => Getting a comment
export async function GET(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const commentID = params.id;
    const comment = await CommentModel.findOne({ _id: commentID });

    return Response.json({ comment }, { status: 200 });
  } catch (error) {
    console.log(" GET ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

//todo => Editing a comment
export async function PATCH(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const reqbody = await req.json();
    const { body } = reqbody;

    const commentID = params.id;

    //*Valiidations
    if (!isValidObjectId(commentID)) {
      return Response.json({ message: "Id is not valid" }, { status: 404 });
    }

    if (!body.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    await CommentModel.findOneAndUpdate({ _id: commentID }, { body });

    return Response.json({ message: "Comment created successfully" }, { status: 200 });
  } catch (error) {
    console.log("Editing a comment => PATCH ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

//todo => Answering to a comment
export async function POST(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const user = await authUser();
    const reqbody = await req.json();

    const { body, score, productID, isAccepted, answerTo } = reqbody;

    const commentID = params.id;

    //*Valiidations
    if (!isValidObjectId(productID)) {
      return Response.json({ message: "Id is not valid" }, { status: 404 });
    }

    if (!isValidObjectId(commentID)) {
      return Response.json({ message: "Id is not valid" }, { status: 404 });
    }
    if (!body.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    const answerComment = {
      body,
      score,
      productID,
      isAccepted,
      answerTo: commentID,
      username: user.name,
      email: user.email,
    };

    //Create an answer comment
    await CommentModel.create({ ...answerComment });

    //To determine the comment is answered
    await CommentModel.findOneAndUpdate({ _id: commentID }, { hasAnswer: true });

    return Response.json({ message: "Comment created successfully" }, { status: 200 });
  } catch (error) {
    console.log("Editing a comment => PATCH ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
