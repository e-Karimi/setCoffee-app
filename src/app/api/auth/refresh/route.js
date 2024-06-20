import { verifyRfereshToken, generateAccessToken } from "@/utils/auth";
import connectedToDB from "@/data/db";
import { cookies } from "next/headers";
import UserModel from "@/models/User";

export async function POST(req) {
  try {
    connectedToDB();

    const refreshToken = cookies().get("refresh-token")?.value;
    if (!refreshToken) {
      return Response.json({ message: "There is no refreshToken" }, { status: 401 });
    }

    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      return Response.json({ message: "User Not found" }, { status: 401 });
    }

    const tokenPayload = verifyRfereshToken(refreshToken);
    if (!tokenPayload) {
      return Response.json({ message: "refreshToken is exired" }, { status: 401 });
    }

    const newAccessToken = generateAccessToken({ email: user?.email });

    return Response.json(
      { message: "new AccessToken generated successfully", newAccessToken },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${newAccessToken};path=/;httpOnly=true`,
        },
      }
    );
  } catch (error) {
    console.log("trfreshtoken => POST ~ error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
