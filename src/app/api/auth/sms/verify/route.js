import connectedToDB from "@/data/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
import { roles } from "@/utils/constants";
import { generateAccessToken } from "@/utils/auth";

export async function POST(req) {
  try {
    connectedToDB();
    const body = await req.json();

    const { phone, code, isSignIn } = body;

    const email = `${phone}@gmail.com`;

    const otp = await OtpModel.findOne({ phone, code });
    if (!otp) {
      return Response.json({ message: " code or phone is not correct" }, { status: 401 });
    }

    const currentTime = new Date().getTime();
    if (otp.expTime < currentTime) {
      return Response.json({ message: " the code has been expired" }, { status: 410 });
    }

    const users = await UserModel.find({});
    const userRole = users.length > 0 ? roles.USER : roles.ADMIN;

    //*Create a new user in DB (in signup procecess => isSignIn=false )
    if (!isSignIn) {
      await UserModel.create({ phone, email, role: userRole });
    }

    const accessToken = generateAccessToken({ email });

    return Response.json(
      { message: "Code verified" },
      {
        status: 202,
        headers: {
          "Set-Cookie": `token=${accessToken};httpOnly=true;path=/`,
        },
      }
    );
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
