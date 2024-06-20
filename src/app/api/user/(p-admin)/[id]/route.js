import UserModel from "@/models/User";
import { isValidObjectId } from "mongoose";
import connectedToDB from "@/data/db";
import { authAdmin } from "@/utils/serverActions";

//todo => deleting a user
export async function DELETE(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const userID = params.id;

    if (!isValidObjectId(userID)) {
      return Response.json({ message: "User ID is not valid" }, { status: 422 });
    }

    const deletedUser = await UserModel.findOneAndDelete({ _id: userID });

    if (!deletedUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "User role deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("DELETE ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

//todo => fetching user's data
export async function GET(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const userID = params.id;

    if (!isValidObjectId(userID)) {
      return Response.json({ message: "User ID is not valid" }, { status: 422 });
    }

    const user = await UserModel.findOne({ _id: userID });

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.log("GET ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

//todo => Editing user's data
export async function PUT(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const userID = params.id;

    if (!isValidObjectId(userID)) {
      return Response.json({ message: "User ID is not valid" }, { status: 422 });
    }

    const body = await req.json();
    const { name, phone, email } = body;

    await UserModel.findOneAndUpdate({ _id: userID }, { name, phone, email });

    return Response.json({ message: "User data updated successfully" }, { status: 200 });
  } catch (error) {
    console.log("PUT ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
