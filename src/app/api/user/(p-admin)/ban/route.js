import BanModel from "@/models/Ban";
import UserModel from "@/models/User";
import { validatePhone, validateEmail } from "@/utils/auth";
import connectedToDB from "@/data/db";
import { authAdmin } from "@/utils/serverActions";

//todo => banning a user
export async function POST(req) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const body = await req.json();
    const { phone, email } = body;

    if (!validatePhone(phone) && !validateEmail(email)) {
      return Response.json({ message: "phone  or email  is not valid" }, { status: 422 });
    }

    //ban user
    await BanModel.create({ phone, email });
    //update user model
    await UserModel.findOneAndUpdate({ $or: [{ phone }, { email }] }, { $set: { isBanned: true } });

    return Response.json({ message: "User banned successfully" }, { status: 200 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
