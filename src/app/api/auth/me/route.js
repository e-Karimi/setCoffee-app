import connectedToDB from "@/data/db";
import UserModel from "@/models/User";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  connectedToDB();

  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return Response.json({ message: "You are not logged in" }, { status: 401 });
    }

    const tokenPayload = verifyAccessToken(token);
    if (!tokenPayload) {
      return Response.json({ message: "You are not logged in" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: tokenPayload.email }, "-password -refreshToken -__v");
    if (!user) {
      return Response.json({ message: "User Not Found" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.log("me ~ error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
