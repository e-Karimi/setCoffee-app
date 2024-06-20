import connectedToDB from "@/data/db";
import UserModel from "@/models/User";
import BanModel from "@/models/Ban";
import {
  verifyPassword,
  generateAccessToken,
  generateRfereshToken,
  validatePassword,
  validatePhone,
  validateEmail,
} from "@/utils/auth";

export async function POST(req) {
  connectedToDB();

  try {
    const body = await req.json();

    const { identifire, password } = body;

    if (!identifire.trim() || !password.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    if (!validatePhone(identifire) && !validateEmail(identifire)) {
      return Response.json({ message: "phone or email is not correct" }, { status: 422 });
    }

    const isUserBanned = await BanModel.findOne({ $or: [{ phone: identifire }, { email: identifire }] });
    if (isUserBanned) {
      return Response.json({ message: "this phone or email  has been already banned" }, { status: 403 });
    }

    const user = await UserModel.findOne({ $or: [{ phone: identifire }, { email: identifire }] });
    if (!user) {
      return Response.json({ message: "phone or email  is not valid => user not found " }, { status: 404 });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword || !validatePassword(password)) {
      return Response.json({ message: "password  is not valid " }, { status: 401 });
    }

    const accessToken = generateAccessToken({ email: user?.email });
    const refreshToken = generateRfereshToken({ email: user?.email });

    await UserModel.findOneAndUpdate({ email: user.email }, { $set: { refreshToken } });

    const headers = new Headers();
    headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true`);
    headers.append("Set-Cookie", `refresh-token=${refreshToken};path=/;httpOnly=true`);

    return Response.json({ message: "You signed in successfully" }, { status: 200, headers });
  } catch (error) {
    console.log("❌signIn ~ error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
