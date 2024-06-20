import DiscountModel from "@/models/Discount";
import connectedToDB from "@/data/db";
import { authUser } from "@/utils/serverActions";
import { roles } from "@/utils/constants";

//todo -> Create a discount code
export async function POST(req) {
  try {
    connectedToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "You are not login" }, { status: 401 });
    }

    if (user.role !== roles.ADMIN) {
      return Response.json({ message: "You are not allowed to access this section" }, { status: 401 });
    }

    const body = await req.json();

    const { code, percent } = body;

    if (!code.trim() || !percent.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    if (isNaN(percent)) {
      return Response.json({ message: "You must enter a number" }, { status: 422 });
    }

    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    //this coupon is expired 5 days after created time
    const expireTime = new Date(year, month, day + 5);

    await DiscountModel.create({
      code,
      percent: Number(percent),
      expire: expireTime,
    });

    return Response.json({ message: "Discount ceated successfully" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

//todo -> applying the discount code to the totalprice
export async function PUT(req) {
  try {
    connectedToDB();

    const user = await authUser();
    if (!user) {
      return Response.json({ message: "You are not login" }, { status: 401 });
    }

    const body = await req.json();
    const { code } = body;

    if (!code.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    const discount = await DiscountModel.findOne({ code });
    if (!discount) {
      return Response.json({ message: "this code not found" }, { status: 404 });
    }

    const nowTime = new Date().getTime();
    const expireTime = new Date(discount.expire).getTime();

    if (nowTime >= expireTime) {
      return Response.json({ message: " the times of code usage  has been  expired" }, { status: 422 });
    }

    return Response.json({ message: "Discount applyed successfully", discount }, { status: 200 });
  } catch (error) {
    console.log("PUT ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
