import connectedToDB from "@/data/db";
import UserModel from "@/models/User";
import BanModel from "@/models/Ban";
import { roles } from "@/utils/constants";
import {
  hashPassword,
  generateAccessToken,
  validatePhone,
  validateEmail,
  validatePassword,
} from "@/utils/auth";

export async function POST(req) {
  connectedToDB();

  try {
    const body = await req.json();

    const { name, phone, password, email } = body;

    if (!validatePhone(phone) || !validatePassword(password)) {
      return Response.json({ message: "data is not correct" }, { status: 422 });
    }

    if (email) {
      if (!validateEmail(email)) {
        return Response.json({ message: "email is not correct" }, { status: 422 });
      }
    }

    const isUserBanned = await BanModel.findOne({ $or: [{ phone }, { email }] });
    if (isUserBanned) {
      return Response.json({ message: "this phone or email  has been already banned" }, { status: 403 });
    }

    const user = await UserModel.findOne({ $or: [{ name }, { phone }, { password }] });

    if (user) {
      return Response.json({ message: "this account already exists " }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const accessToken = generateAccessToken({ name });

    const users = await UserModel.find({});
    const userRole = users.length > 0 ? roles.USER : roles.ADMIN;

    await UserModel.create({
      name,
      phone,
      password: hashedPassword,
      email,
      role: userRole,
    });

    return Response.json(
      { message: "You signed up successfully" },
      { status: 201, headers: { "Set-Cookie": `token=${accessToken};path=/;httpOnly=true` } }
    );
  } catch (error) {
    console.log("❌signup ~ error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
